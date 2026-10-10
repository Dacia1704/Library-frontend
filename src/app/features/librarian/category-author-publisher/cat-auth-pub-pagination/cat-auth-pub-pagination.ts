import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

@Component({
  selector: 'app-cat-auth-pub-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cat-auth-pub-pagination.html',
  styleUrls: ['./cat-auth-pub-pagination.scss'],
})
export class CatAuthPubPaginationComponent {
  @Input() pagination: Pagination = {
    page: 0,
    size: 12,
    totalElements: 0,
    totalPages: 0,
  };

  @Output() pageChange = new EventEmitter<number>();
  @Output() sizeChange = new EventEmitter<number>();

  // Options for page size
  readonly pageSizes = [12, 18, 24];

  get selectedSize(): number {
    return this.pagination.size;
  }

  set selectedSize(value: number) {
    // This setter is needed for ngModel but we emit through the event
  }

  get visiblePages(): number[] {
    const { page, totalPages } = this.pagination;
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const pages: number[] = [];

    if (page <= 2) {
      pages.push(0, 1, 2, 3, -1, totalPages - 1);
    } else if (page >= totalPages - 3) {
      pages.push(0, -1, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1);
    } else {
      pages.push(0, -1, page - 1, page, page + 1, -1, totalPages - 1);
    }

    return pages;
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.pagination.totalPages) {
      this.pageChange.emit(page);
    }
  }

  onSizeChange(size: number): void {
    this.sizeChange.emit(size);
  }
}
