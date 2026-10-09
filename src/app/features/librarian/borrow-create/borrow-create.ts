import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BorrowCreateViolationAlertComponent } from './borrow-create-violation-alert/borrow-create-violation-alert';

import { Member } from '@model/member/member.model';
import { Book } from '@model/book/book.model';
import { BorrowRecordRequest } from '@model/borrow-record/request/borrow-record-request';
import { AuthService } from '@core/services/auth.service';
import { BorrowRecordService } from '@core/services/borrow-record.service';
import { ToastService } from '@core/services/toast.service';
import { BorrowCreateBreadcrumbComponent } from './borrow-create-breadcrumb/borrow-create-breadcrumb';
import { BorrowCreateHeaderComponent } from './borrow-create-header/borrow-create-header';
import { BorrowCreateFlowComponent } from './borrow-create-flow/borrow-create-flow';
import { BorrowCreateSummaryComponent } from './borrow-create-summary/borrow-create-summary';

@Component({
  selector: 'app-borrow-create-page',
  standalone: true,
  imports: [
    CommonModule,
    BorrowCreateBreadcrumbComponent,
    BorrowCreateHeaderComponent,
    BorrowCreateViolationAlertComponent,
    BorrowCreateFlowComponent,
    BorrowCreateSummaryComponent,
  ],
  templateUrl: './borrow-create.html',
  styleUrls: ['./borrow-create.scss'],
})
export class BorrowCreatePage {
  private readonly authService = inject(AuthService);
  private readonly borrowRecordService = inject(BorrowRecordService);
  private readonly toast = inject(ToastService);

  /** Current librarian info (from localStorage session). */
  get currentLibrarian(): { name: string; id: string } {
    const user = this.authService.user;
    return {
      name: user?.username ?? '',
      id: user?.id != null ? `#${user.id}` : '',
    };
  }

  readonly maxBorrowQuota = 5;

  // Selected patron (domain model)
  selectedPatron: Member | null = null;

  // Selected books (domain model)
  selectedBooks: Book[] = [];

  // Form state
  borrowDays = 14;
  dueDate = this.calculateDueDate(14);
  notes = 'Sách tình trạng tốt, bìa nguyên vẹn, bạn đọc kiểm tra trước khi nhận.';

  // Violation state
  hasViolation = false;
  violationMessage = '';

  get selectedBooksCount(): number {
    return this.selectedBooks.length;
  }

  get quotaText(): string {
    return `${this.selectedBooksCount}/${this.maxBorrowQuota}`;
  }

  get canCreateTicket(): boolean {
    return (
      this.selectedPatron !== null &&
      this.selectedBooksCount > 0 &&
      this.selectedBooksCount <= this.maxBorrowQuota &&
      !this.hasViolation &&
      !this.selectedPatron.isExpired
    );
  }

  private calculateDueDate(days: number): string {
    const today = new Date();
    const due = new Date(today);
    due.setDate(today.getDate() + days);

    const day = String(due.getDate()).padStart(2, '0');
    const month = String(due.getMonth() + 1).padStart(2, '0');
    const year = due.getFullYear();

    return `${day}/${month}/${year}`;
  }

  // ===== Patron Selection =====
  onPatronChange(member: Member): void {
    this.selectedPatron = member;
    this.checkViolation();
  }

  private checkViolation(): void {
    if (!this.selectedPatron) {
      this.hasViolation = false;
      this.violationMessage = '';
      return;
    }

    const fineAmount = (this.selectedPatron as any).fineAmount ?? 0;
    const booksHeld = (this.selectedPatron as any).booksHeld ?? 0;

    if (this.selectedPatron.isExpired) {
      this.hasViolation = true;
      this.violationMessage = `Thẻ độc giả đã hết hạn. Không thể lập phiếu mượn.`;
    } else if (fineAmount >= 50000) {
      this.hasViolation = true;
      this.violationMessage = `Độc giả có khoản phạt nợ vượt ngưỡng quy định: ${this.formatCurrency(fineAmount)} (Giới hạn cho phép: 50.000 VNĐ).`;
    } else if (booksHeld >= this.maxBorrowQuota) {
      this.hasViolation = true;
      this.violationMessage = `Độc giả đã đạt tối đa hạn mức mượn ${this.maxBorrowQuota} cuốn.`;
    } else {
      this.hasViolation = false;
      this.violationMessage = '';
    }
  }

  // ===== Book Selection =====
  onBookSelected(book: Book): void {
    if (this.selectedBooksCount >= this.maxBorrowQuota) {
      return;
    }

    if (!this.selectedBooks.find((b) => b.id === book.id)) {
      this.selectedBooks = [...this.selectedBooks, book];
    }
  }

  onBookRemoved(bookId: number): void {
    this.selectedBooks = this.selectedBooks.filter((b) => b.id !== bookId);
  }

  // ===== Days Selection =====
  setBorrowDays(days: number): void {
    this.borrowDays = days;
    this.dueDate = this.calculateDueDate(days);
  }

  onDaysChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const days = parseInt(input.value) || 14;
    if (days >= 1 && days <= 14) {
      this.setBorrowDays(days);
    }
  }

  // ===== Notes =====
  onNotesChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.notes = textarea.value;
  }

  // ===== Violation Alert =====
  dismissViolation(): void {
    // User acknowledged the violation, keep it visible but allow dismissing the alert
  }

  // ===== Actions =====
  refreshForm(): void {
    this.selectedPatron = null;
    this.selectedBooks = [];
    this.borrowDays = 14;
    this.dueDate = this.calculateDueDate(14);
    this.notes = 'Sách tình trạng tốt, bìa nguyên vẹn, bạn đọc kiểm tra trước khi nhận.';
    this.hasViolation = false;
    this.violationMessage = '';
  }

  submitBorrowTicket(): void {
    if (!this.canCreateTicket || !this.selectedPatron) {
      return;
    }

    const payload: BorrowRecordRequest = {
      memberId: String(this.selectedPatron.id),
      librarianId: String(this.authService.user?.id ?? ''),
      borrowDate: this.formatLocalDate(new Date()),
      dayBorrow: this.borrowDays,
      note: this.notes,
      bookIds: this.selectedBooks.map((b) => String(b.id)),
    };

    this.borrowRecordService.create(payload).subscribe({
      next: (response) => {
        console.log('Created borrow ticket:', response.data);
        this.toast.success('Tạo phiếu mượn thành công!');
        this.refreshForm();
      },
      error: (err) => {
        console.error('Lỗi khi tạo phiếu mượn:', err);
        this.toast.error(
          err?.error?.message ?? 'Không thể tạo phiếu mượn. Vui lòng thử lại.'
        );
      },
    });
  }

  private formatLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  printAndSave(): void {
    console.log('Print and save');
  }

  cancelTransaction(): void {
    console.log('Cancel transaction');
  }

  // ===== Helpers =====
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  }
}
