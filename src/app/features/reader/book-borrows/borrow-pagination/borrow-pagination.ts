import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-borrow-pagination',
  standalone: true,
  templateUrl: './borrow-pagination.html',
  styleUrls: ['./borrow-pagination.scss'],
})
export class BorrowPagination {
  @Input({ required: true }) total: number = 0;
  @Input({ required: true }) page: number = 1;
  @Input({ required: true }) size: number = 4;

  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.size));
  }

  get from(): number {
    return this.total === 0 ? 0 : (this.page - 1) * this.size + 1;
  }

  get to(): number {
    return Math.min(this.page * this.size, this.total);
  }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.page;
    const pages: number[] = [];
    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (current > 3) pages.push(-1);
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push(-1);
    pages.push(total);
    return pages;
  }

  goTo(p: number) {
    if (p < 1 || p > this.totalPages || p === this.page) return;
    this.pageChange.emit(p);
  }
}