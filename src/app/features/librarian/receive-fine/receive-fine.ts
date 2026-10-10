import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceiveFineBreadcrumbComponent } from './receive-fine-breadcrumb/receive-fine-breadcrumb';
import { ReceiveFineHeaderComponent } from './receive-fine-header/receive-fine-header';
import { ReceiveFineSearchComponent } from './receive-fine-search/receive-fine-search';
import { ReceiveFineMemberCardComponent } from './receive-fine-member-card/receive-fine-member-card';
import { ReceiveFineFineListComponent } from './receive-fine-fine-list/receive-fine-fine-list';
import { ReceiveFinePaymentListComponent } from './receive-fine-payment-list/receive-fine-payment-list';
import { ReceiveFinePaymentFormComponent } from './receive-fine-payment-form/receive-fine-payment-form';
import { ReceiveFinePolicyComponent } from './receive-fine-policy/receive-fine-policy';

import { Member } from '@model/member/member.model';
import { Fine } from '@model/fine/fine.model';
import { FinePayment } from '@model/fine/fine-payment.model';
import { FineService } from '@core/services/fine.service';
import { FinePaymentService } from '@core/services/fine-payment.service';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@core/services/toast.service';
import { SettingService } from '@core/services/setting.service';

type FineTab = 'FINES' | 'PAYMENTS';

@Component({
  selector: 'app-receive-fine-page',
  standalone: true,
  imports: [
    CommonModule,
    ReceiveFineBreadcrumbComponent,
    ReceiveFineHeaderComponent,
    ReceiveFineSearchComponent,
    ReceiveFineMemberCardComponent,
    ReceiveFineFineListComponent,
    ReceiveFinePaymentListComponent,
    ReceiveFinePaymentFormComponent,
    ReceiveFinePolicyComponent,
  ],
  templateUrl: './receive-fine.html',
  styleUrls: ['./receive-fine.scss'],
})
export class ReceiveFinePage {
  private readonly authService = inject(AuthService);
  private readonly fineService = inject(FineService);
  private readonly finePaymentService = inject(FinePaymentService);
  private readonly toast = inject(ToastService);

  /** Current librarian info. */
  get currentLibrarian(): { name: string; id: string } {
    const user = this.authService.user;
    return {
      name: user?.username ?? '',
      id: user?.id != null ? `#${user.id}` : '',
    };
  }

  // === Signals ===
  selectedMember = signal<Member | null>(null);
  activeTab = signal<FineTab>('FINES');

  // Fine data
  fines = signal<Fine[]>([]);
  totalFineAmount = signal<number>(0);

  // Payment data
  payments = signal<FinePayment[]>([]);
  paidAmount = signal<number>(0);
  paymentPage = signal<number>(0);
  paymentTotalElements = signal<number>(0);
  paymentSize = 10;

  // Computed metrics (using signals)
  unpaidAmount = computed(() => this.totalFineAmount() - this.paidAmount());
  unpaidFineCount = computed(() => this.fines().length);
  paidFineCount = computed(() => this.paymentTotalElements());
  totalPaymentPages = computed(() => Math.ceil(this.paymentTotalElements() / this.paymentSize));
  isCardLocked = computed(() => {
    const member = this.selectedMember();
    const maxFine = SettingService.getMaxFineBeforeBlock();
    return member?.cardStatus !== undefined && this.unpaidAmount() > maxFine;
  });

  // Settings
  get fineOverduePerDay(): number {
    return SettingService.getFineOverduePerDay();
  }

  // === Member Selection ===
  onMemberChange(member: Member): void {
    this.selectedMember.set(member);
    this.resetData();
    this.loadTotalFines(member.id);
    this.loadTotalPaid(member.id);
    this.loadFines(member.id);
    this.loadPayments(member.id, 0);
  }

  private resetData(): void {
    this.fines.set([]);
    this.payments.set([]);
    this.totalFineAmount.set(0);
    this.paidAmount.set(0);
    this.paymentPage.set(0);
    this.paymentTotalElements.set(0);
    this.activeTab.set('FINES');
  }

  private loadTotalFines(memberId: number): void {
    this.fineService.getTotalByMemberId(memberId).subscribe({
      next: (total) => this.totalFineAmount.set(total),
      error: (err) => console.error('Error loading total fines:', err),
    });
  }

  private loadTotalPaid(memberId: number): void {
    this.finePaymentService.getTotalByMemberId(memberId).subscribe({
      next: (total) => this.paidAmount.set(total),
      error: (err) => console.error('Error loading total paid:', err),
    });
  }

  private loadFines(memberId: number): void {
    this.fineService.getAll(memberId, 0, 100).subscribe({
      next: (response) => this.fines.set(response.data),
      error: (err) => {
        console.error('Error loading fines:', err);
        this.toast.error('Không thể tải danh sách phạt');
      },
    });
  }

  private loadPayments(memberId: number, page: number): void {
    this.finePaymentService.getAll(memberId, page, this.paymentSize).subscribe({
      next: (response) => {
        this.payments.set(response.data);
        this.paymentPage.set(response.currentPage);
        this.paymentTotalElements.set(response.totalElements);
      },
      error: (err) => console.error('Error loading payments:', err),
    });
  }

  // === Tab ===
  setActiveTab(tab: FineTab): void {
    this.activeTab.set(tab);
  }

  // === Pagination ===
  onPaymentPageChange(page: number): void {
    const member = this.selectedMember();
    if (member) {
      this.loadPayments(member.id, page);
    }
  }

  // === Payment Form ===
  paymentAmount = 0;
  paymentNote = '';
  paymentMethod: 'CASH' | 'VIETQR' = 'CASH';
  autoPrint = true;
  autoUnlock = true;

  onPaymentAmountChange(amount: number): void {
    this.paymentAmount = amount;
  }

  onPaymentNoteChange(note: string): void {
    this.paymentNote = note;
  }

  onPaymentMethodChange(method: 'CASH' | 'VIETQR'): void {
    this.paymentMethod = method;
  }

  setPresetAmount(amount: number): void {
    this.paymentAmount = amount;
  }

  submitPayment(): void {
    const member = this.selectedMember();
    if (!member || this.paymentAmount <= 0) {
      this.toast.error('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    if (this.paymentAmount > this.unpaidAmount()) {
      this.toast.error('Số tiền không được vượt quá dư nợ');
      return;
    }

    const request = {
      memberId: member.id,
      amount: this.paymentAmount,
      note: this.paymentNote || `Thu tiền phạt độc giả ${member.memberCode}`,
    };

    this.finePaymentService.create(request).subscribe({
      next: (response) => {
        this.toast.success(`Thu tiền phạt thành công: ${this.formatCurrency(response.amount)}`);
        
        // Update paid amount
        this.paidAmount.update(v => v + response.amount);
        
        // Refresh payments list
        this.loadPayments(member.id, 0);
        
        this.resetPaymentForm();
        
        // Check if debt is cleared
        if (this.unpaidAmount() === 0 && this.autoUnlock) {
          this.toast.info('Độc giả đã thanh toán hết. Thẻ đã được mở khóa tự động.');
        }
      },
      error: (err) => {
        console.error('Error creating payment:', err);
        this.toast.error(err?.error?.message ?? 'Không thể tạo thanh toán');
      },
    });
  }

  resetPaymentForm(): void {
    this.paymentAmount = 0;
    this.paymentNote = '';
    this.paymentMethod = 'CASH';
  }

  // === Actions ===
  refreshData(): void {
    const member = this.selectedMember();
    if (member) {
      this.loadTotalFines(member.id);
      this.loadTotalPaid(member.id);
      this.loadFines(member.id);
      this.loadPayments(member.id, 0);
    }
    this.resetPaymentForm();
  }

  // === Helpers ===
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  }
}
