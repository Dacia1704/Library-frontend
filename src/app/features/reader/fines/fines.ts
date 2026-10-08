import { Component, OnInit, OnDestroy, ViewChild, signal, computed } from '@angular/core';
import { Subject, takeUntil, forkJoin } from 'rxjs';

import { FineService } from '@core/services/fine.service';
import { FinePaymentService } from '@core/services/fine-payment.service';
import { Fine, FinePayment, FineSummary } from '@model/fine';

import { FinesHeaderComponent } from './fines-header/fines-header';
import { FinesNoticeBannerComponent } from './fines-notice-banner/fines-notice-banner';
import { FinesStatsComponent } from './fines-stats/fines-stats';
import { FinesTabsComponent } from './fines-tabs/fines-tabs';
import { FinesFilterBarComponent, FinesFilterParams } from './fines-filter-bar/fines-filter-bar';
import { FinesTableComponent } from './fines-table/fines-table';
import { FineTariffLegendComponent } from './fine-tariff-legend/fine-tariff-legend';
import { FinesHistoryTableComponent } from './fines-history-table/fines-history-table';
import { FinesFaqComponent } from './fines-faq/fines-faq';
import { PolicyDialogComponent } from './policy-dialog/policy-dialog';
import { ReceiptDialogComponent } from './receipt-dialog/receipt-dialog';

@Component({
  selector: 'app-fines',
  standalone: true,
  imports: [
    FinesHeaderComponent,
    FinesNoticeBannerComponent,
    FinesStatsComponent,
    FinesTabsComponent,
    FinesFilterBarComponent,
    FinesTableComponent,
    FineTariffLegendComponent,
    FinesHistoryTableComponent,
    FinesFaqComponent,
    PolicyDialogComponent,
    ReceiptDialogComponent,
  ],
  templateUrl: './fines.html',
  styleUrls: ['./fines.scss'],
})
export class FinesComponent implements OnInit, OnDestroy {
  @ViewChild('policyDialog') policyDialogComponent!: PolicyDialogComponent;
  @ViewChild('receiptDialog') receiptDialogComponent!: ReceiptDialogComponent;

  private destroy$ = new Subject<void>();

  // ===== State as Signals (tự động trigger view update khi đổi) =====
  readonly summary = signal<FineSummary | null>(null);
  readonly fines = signal<Fine[]>([]);
  readonly payments = signal<FinePayment[]>([]);
  readonly activeTab = signal<'fines' | 'history'>('fines');
  readonly filters = signal<FinesFilterParams>({ search: '', reason: 'all', status: 'all' });
  readonly selectedPayment = signal<FinePayment | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  // Computed signals (auto-recalc khi dependency đổi)
  readonly filteredFines = computed<Fine[]>(() => this.applyFilters(this.fines(), this.filters()));
  readonly historyCount = computed<number>(() => this.payments().length);
  readonly totalPayments = computed<number>(() => this.payments().length);
  readonly totalPaidAmount = computed<number>(() =>
    this.payments().reduce((sum, p) => sum + p.amount, 0)
  );

  constructor(
    private fineService: FineService,
    private finePaymentService: FinePaymentService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load song song: danh sách fines + danh sách payments + tổng tiền
   * từ backend. Sau đó tự tính summary dựa trên dữ liệu trả về.
   */
  loadData(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    forkJoin({
      finesPage: this.fineService.getMyFines(0, 100),
      paymentsPage: this.finePaymentService.getMyPayments(0, 100),
      unpaidTotal: this.fineService.getMyTotal(),
      paidTotal: this.finePaymentService.getMyTotal(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ finesPage, paymentsPage, unpaidTotal, paidTotal }) => {
          this.fines.set(finesPage.data || []);
          this.payments.set(paymentsPage.data || []);
          this.summary.set(this.buildSummary(this.fines(), unpaidTotal, paidTotal));
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading fines data:', err);
          this.errorMessage.set('Không thể tải dữ liệu khoản phạt. Vui lòng thử lại sau.');
          this.fines.set([]);
          this.payments.set([]);
          this.summary.set(null);
          this.isLoading.set(false);
        },
      });
  }

  /**
   * Tính summary thống kê dựa trên danh sách fines và 2 tổng tiền từ backend.
   * - unpaidTotal: tổng tiền phạt còn phải nộp (từ GET /fines/total/me)
   * - paidTotal: tổng tiền đã thanh toán (từ GET /fine-payments/total/me)
   */
  private buildSummary(
    fines: Fine[],
    unpaidTotal: number,
    paidTotal: number
  ): FineSummary {

    return {
      totalFines: unpaidTotal + paidTotal,
      totalFinesCount: fines.length,
      paidAmount: paidTotal,
      unpaidAmount: unpaidTotal,
    };
  }

  // Filter logic
  onFiltersChange(filters: FinesFilterParams): void {
    this.filters.set(filters);
  }

  resetFilters(): void {
    this.filters.set({ search: '', reason: 'all', status: 'all' });
  }

  private applyFilters(fines: Fine[], filters: FinesFilterParams): Fine[] {
    return fines.filter((fine) => {
      return true;
    });
  }

  // Tab switching
  switchTab(tab: 'fines' | 'history'): void {
    this.activeTab.set(tab);
  }

  // Actions
  showPolicyDialog(): void {
    const dialogEl = document.getElementById('policy-dialog') as HTMLDialogElement;
    if (this.policyDialogComponent && dialogEl) {
      this.policyDialogComponent.show(dialogEl);
    } else if (dialogEl) {
      dialogEl.showModal();
    }
  }

  showReceiptDialog(payment: FinePayment): void {
    this.selectedPayment.set(payment);
    const dialogEl = document.getElementById('receipt-dialog') as HTMLDialogElement;
    if (this.receiptDialogComponent && dialogEl) {
      this.receiptDialogComponent.show(dialogEl);
    } else if (dialogEl) {
      dialogEl.showModal();
    }
  }

  printStatement(): void {
    window.print();
  }

  printReceipt(payment: FinePayment): void {
    window.print();
  }
}