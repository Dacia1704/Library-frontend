import { Component, input, output, computed, signal } from '@angular/core';
import { BorrowRecord } from '@model/borrow-record/borrow-record';
import { TextUtils } from '@shared/utils/text-utils';

@Component({
  selector: 'app-borrow-record-table',
  standalone: true,
  imports: [],
  templateUrl: './borrow-record-table.html',
  styleUrls: ['./borrow-record-table.scss'],
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
  readonly viewRecord = output<BorrowRecord>();

  // ===== Selection =====
  readonly selectedId = signal<number | null>(null);

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

  // ===== Helpers =====
  formatDate(date: Date): string {
    return TextUtils.formatDate(date, 'dd/MM/yyyy');
  }

  selectRecord(record: BorrowRecord): void {
    this.selectedId.set(record.id);
    this.viewRecord.emit(record);
  }

  isSelected(id: number): boolean {
    return this.selectedId() === id;
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

  onPageSizeChange(size: number): void {
    this.pageSizeChange.emit(size);
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
}
