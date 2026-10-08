import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BorrowDetail } from '@model/borrow-record/borrow-detail';
import { BorrowDetailFilter } from '@model/borrow-record/request/borrow-detail-filter';
import { BorrowDetailSummaryResponse } from '@model/borrow-record/response/borrow-detail-summary-response';
import { BorrowStatus } from '@model/enum/borrow-status.enum';
import { BorrowDetailService } from '@services/borrow-detail.service';
import { BorrowFilterBar, BorrowFilterValue } from './borrow-filter-bar/borrow-filter-bar';
import { BorrowStatChip } from './borrow-filter-bar/borrow-filter-bar';
import { BorrowHeader } from './borrow-header/borrow-header';
import { BorrowNoticeBanner } from './borrow-notice-banner/borrow-notice-banner';
import { BorrowPagination } from './borrow-pagination/borrow-pagination';
import { BorrowRecordCard } from './borrow-record-card/borrow-record-card';
import { BorrowRules } from './borrow-rules/borrow-rules';
import { BorrowStats } from './borrow-stats/borrow-stats';

@Component({
  selector: 'app-book-borrows',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BorrowHeader,
    BorrowStats,
    BorrowNoticeBanner,
    BorrowFilterBar,
    BorrowRecordCard,
    BorrowPagination,
    BorrowRules,
  ],
  templateUrl: './book-borrows.html',
  styleUrls: ['./book-borrows.scss'],
})
export class BookBorrows implements OnInit {
  private borrowDetailService = inject(BorrowDetailService);

  // ─── State ────────────────────────────────────────────────────────
  readonly records = signal<BorrowDetail[]>([]);
  readonly totalElements = signal(0);
  readonly summary = signal<BorrowDetailSummaryResponse | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  page = 1;
  size = 10;

  // ─── Derived: stat chips từ summary ───────────────────────────────
  readonly statChips = computed<BorrowStatChip[]>(() => {
    const s = this.summary();
    if (!s) return [];
    const all: BorrowStatChip = { key: 'all', label: 'Tất cả', count: s.total, tone: 'primary' };
    const borrowing: BorrowStatChip = { key: BorrowStatus.BORROWING, label: 'Đang mượn', count: s.borrowing, tone: 'secondary' };
    const returned: BorrowStatChip = { key: BorrowStatus.RETURNED, label: 'Đã trả', count: s.returned, tone: 'muted' };
    const overdue: BorrowStatChip = { key: BorrowStatus.OVERDUE, label: 'Quá hạn', count: s.overdue, tone: 'error' };
    return [all, borrowing, returned, overdue];
  });

  // ─── API calls ─────────────────────────────────────────────────────
  ngOnInit() {
    this.loadSummary();
    this.loadRecords();
  }

  private loadSummary() {
    this.borrowDetailService.getMySummary().subscribe({
      next: response => this.summary.set(response.data),
      error: err => console.error('Lỗi khi tải summary:', err),
    });
  }

  private loadRecords() {
    this.isLoading.set(true);
    this.error.set(null);

    const filter: BorrowDetailFilter = {};

    this.borrowDetailService
      .getMyPagination(filter, this.page-1, this.size)
      .subscribe({
        next: response => {
          this.records.set(response.data.data);
          this.totalElements.set(response.data.totalElements ?? 0);
          this.isLoading.set(false);
        },
        error: err => {
          console.error('Lỗi khi tải danh sách mượn trả:', err);
          this.error.set('Không thể tải danh sách. Vui lòng thử lại.');
          this.isLoading.set(false);
        },
      });
  }

  // ─── Handlers ─────────────────────────────────────────────────────
  onFilterChange(value: BorrowFilterValue) {
    this.page = 1;
    this.applyFilter(value);
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadRecords();
  }

  private applyFilter(value: BorrowFilterValue) {
    this.isLoading.set(true);
    const filter: BorrowDetailFilter = {
      keyword: value.keyword || undefined,
    };
    if (value.status && value.status !== 'all') {
      filter.status = value.status;
    }

    this.borrowDetailService
      .getMyPagination(filter, this.page - 1, this.size)
      .subscribe({
        next: response => {
          this.records.set(response.data.data);
          this.totalElements.set(response.data.totalElements ?? 0);
          this.isLoading.set(false);
        },
        error: err => {
          console.error('Lỗi filter:', err);
          this.isLoading.set(false);
        },
      });
  }
}
