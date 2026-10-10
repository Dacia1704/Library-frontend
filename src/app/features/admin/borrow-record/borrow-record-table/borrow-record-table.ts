import { Component, input, output, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { BorrowRecord } from '@model/borrow-record/borrow-record';
import { BorrowRecordFilter } from '@model/borrow-record/request/borrow-record-filter';
import { BorrowStatus } from '@model/enum/borrow-status.enum';
import { TextUtils } from '@shared/utils/text-utils';

@Component({
  selector: 'app-borrow-record-table',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './borrow-record-table.html',
  styleUrl: './borrow-record-table.scss',
})
export class BorrowRecordTableComponent {
  // ===== Inputs =====
  readonly records = input<BorrowRecord[]>([]);
  readonly totalElements = input<number>(0);
  readonly currentPage = input<number>(0);
  readonly pageSize = input<number>(10);
  readonly isLoading = input<boolean>(false);

  // ===== Outputs =====
  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();
  readonly filterChange = output<BorrowRecordFilter>();
  readonly viewRecord = output<BorrowRecord>();

  // ===== Filter State =====
  readonly memberKeyword = signal('');
  readonly bookKeyword = signal('');
  readonly startBorrowDate = signal('');
  readonly endBorrowDate = signal('');
  readonly status = signal<BorrowStatus | ''>('');

  // ===== Computed =====
  readonly totalPages = computed(() => {
    const total = this.totalElements();
    const size = this.pageSize();
    if (total === 0 || size === 0) return 1;
    return Math.ceil(total / size);
  });

  readonly pageRangeStart = computed(() => {
    return this.currentPage() * this.pageSize() + 1;
  });

  readonly pageRangeEnd = computed(() => {
    const end = (this.currentPage() + 1) * this.pageSize();
    return Math.min(end, this.totalElements());
  });

  readonly pageSizeOptions = [8, 15, 30, 50];

  // ===== Filter Methods =====
  onFilterChange(): void {
    const filter: BorrowRecordFilter = {};
    if (this.memberKeyword()) filter.memberKeyword = this.memberKeyword();
    if (this.bookKeyword()) filter.bookKeyword = this.bookKeyword();
    if (this.startBorrowDate()) filter.startBorrowDate = this.startBorrowDate();
    if (this.endBorrowDate()) filter.endBorrowDate = this.endBorrowDate();
    if (this.status()) filter.status = this.status() as BorrowStatus;
    this.filterChange.emit(filter);
  }

  resetFilters(): void {
    this.memberKeyword.set('');
    this.bookKeyword.set('');
    this.startBorrowDate.set('');
    this.endBorrowDate.set('');
    this.status.set('');
    this.onFilterChange();
  }

  // ===== Table Actions =====
  onViewRecord(record: BorrowRecord): void {
    this.viewRecord.emit(record);
  }

  // ===== Pagination =====
  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(size: number): void {
    this.pageSizeChange.emit(size);
  }

  // ===== Helpers =====
  formatDate(date: Date): string {
    return TextUtils.formatDate(date, 'dd/MM/yyyy');
  }

  getRecordStatus(record: BorrowRecord): string {
    return record.status;
  }

  getStatusText(record: BorrowRecord): string {
    const statusMap: Record<string, string> = {
      'borrowing': 'Đang mượn',
      'returned': 'Đã trả',
      'overdue': 'Quá hạn',
    };
    return statusMap[record.status] || record.status;
  }

  getBookCount(record: BorrowRecord): number {
    return record.borrowDetails.length;
  }

  // ===== Pagination page buttons =====
  get pageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 5) {
      for (let i = 0; i < total; i++) pages.push(i);
    } else {
      const start = Math.max(0, current - 2);
      const end = Math.min(total - 1, start + 4);
      for (let i = start; i <= end; i++) pages.push(i);
    }

    return pages;
  }

  isFirstPage(): boolean {
    return this.currentPage() === 0;
  }

  isLastPage(): boolean {
    return this.currentPage() >= this.totalPages() - 1;
  }
}
