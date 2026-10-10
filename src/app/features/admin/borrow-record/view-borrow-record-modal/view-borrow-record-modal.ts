import { Component, input, output, computed, signal } from '@angular/core';
import { BorrowRecord } from '@model/borrow-record/borrow-record';
import { BorrowStatus } from '@model/enum/borrow-status.enum';
import { TextUtils } from '@shared/utils/text-utils';

@Component({
  selector: 'app-view-borrow-record-modal',
  standalone: true,
  imports: [],
  templateUrl: './view-borrow-record-modal.html',
  styleUrls: ['./view-borrow-record-modal.scss'],
})
export class ViewBorrowRecordModalComponent {
  // ===== Input =====
  readonly record = input<BorrowRecord | null>(null);

  // ===== Output =====
  readonly closed = output<void>();

  // ===== Computed =====
  readonly isOpen = computed(() => this.record() !== null);

  readonly member = computed(() => this.record()?.member ?? null);
  readonly librarian = computed(() => this.record()?.librarian ?? null);
  readonly borrowDetails = computed(() => this.record()?.borrowDetails ?? []);
  readonly status = computed(() => this.record()?.status ?? 'borrowing');
  readonly overdueDays = computed(() => this.record()?.overdueDays ?? 0);
  readonly totalFine = computed(() => {
    return this.borrowDetails().reduce((sum, d) => sum + (d.fineAmount ?? 0), 0);
  });

  readonly returnedCount = computed(() =>
    this.borrowDetails().filter(d => d.borrowStatus === BorrowStatus.RETURNED).length
  );

  readonly totalBooks = computed(() => this.borrowDetails().length);

  // ===== Helpers =====
  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN');
  }

  formatDateTime(date: Date): string {
    const d = new Date(date);
    return d.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString('vi-VN');
  }

  isBookReturned(detail: BorrowRecord['borrowDetails'][0]): boolean {
    return detail.borrowStatus === BorrowStatus.RETURNED;
  }

  getBookOverdueDays(detail: BorrowRecord['borrowDetails'][0]): number {
    const record = this.record();
    if (!record) return 0;
    if (detail.returnDate) {
      const diff = new Date(detail.returnDate).getTime() - record.dueDate.getTime();
      return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }
    const today = new Date();
    const diff = today.getTime() - record.dueDate.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  getFineRatePerDay(): number {
    return 5000;
  }

  getAvatarLetter(fullName: string): string {
    return fullName?.charAt(0)?.toUpperCase() ?? '?';
  }

  close(): void {
    this.closed.emit();
  }
}
