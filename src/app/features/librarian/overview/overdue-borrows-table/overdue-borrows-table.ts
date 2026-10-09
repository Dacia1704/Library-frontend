import { Component, inject, OnInit, signal } from '@angular/core';
import { BorrowDetail } from '@model/borrow-record/borrow-detail';
import { BorrowDetailFilter } from '@model/borrow-record/request/borrow-detail-filter';
import { PageResponse } from '@model/api-response';
import { BorrowStatus } from '@model/enum/borrow-status.enum';
import { BorrowDetailService } from '@services/borrow-detail.service';

@Component({
  selector: 'app-overdue-borrows-table',
  standalone: true,
  imports: [],
  templateUrl: './overdue-borrows-table.html',
  styleUrls: ['./overdue-borrows-table.scss'],
})
export class OverdueBorrowsTableComponent implements OnInit {
  private borrowDetailService = inject(BorrowDetailService);

  readonly borrows = signal<BorrowDetail[]>([]);
  readonly isLoading = signal(false);
  readonly currentPage = signal(0);
  readonly totalPages = signal<number>(0);
  readonly totalElements = signal<number>(0);
  readonly pageSize = 10;

  ngOnInit(): void {
    this.loadOverdueBorrows(this.currentPage());
  }

  private loadOverdueBorrows(page: number): void {
    this.isLoading.set(true);
    const filter: BorrowDetailFilter = { status: BorrowStatus.OVERDUE };
    this.borrowDetailService.getPagination(filter, page, this.pageSize).subscribe({
      next: response => {
        const pageData: PageResponse<BorrowDetail> = response.data;
        this.borrows.set(pageData.data);
        this.totalPages.set(pageData.totalPages);
        this.totalElements.set(pageData.totalElements);
        this.currentPage.set(pageData.currentPage);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages()) return;
    this.loadOverdueBorrows(page);
  }

  get overdueCount(): number {
    return this.totalElements();
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i);
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '-';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('vi-VN');
  }

  calcOverdueDays(dueDate: Date | string | undefined): number {
    if (!dueDate) return 0;
    const d = dueDate instanceof Date ? dueDate : new Date(dueDate);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }
}