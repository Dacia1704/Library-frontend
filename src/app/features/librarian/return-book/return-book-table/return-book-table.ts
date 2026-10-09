import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BorrowDetail } from '@model/borrow-record/borrow-record';
import { ImageUtils } from '@shared/utils/image-utils';

export interface BorrowedBook {
  id: string;
  number: number;
  title: string;
  author: string;
  publisher: string;
  cover: string;
  barcode: string;
  price: number;
  shelf: string;
  status: 'pending' | 'overdue' | 'returned';
  overdueDays?: number;
  returnDate?: string;
  returnedBy?: string;
  condition?: 'good' | 'damaged-light' | 'damaged-heavy' | 'damaged-unusable' | 'lost';
  damageNote?: string;
  damageImageUrl?: string;
  detail: BorrowDetail;
}

@Component({
  selector: 'app-return-book-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './return-book-table.html',
  styleUrls: ['./return-book-table.scss'],
})
export class ReturnBookTableComponent {
  @Input() books: BorrowedBook[] = [];
  @Input() totalBooks = 0;
  @Output() processReturn = new EventEmitter<BorrowedBook>();
  @Output() quickReturnAll = new EventEmitter<void>();
  @Output() selectAll = new EventEmitter<void>();

  selectedBooks = signal<Set<string>>(new Set());

  get selectedCount(): number {
    return this.selectedBooks().size;
  }

  get pendingBooks(): BorrowedBook[] {
    return this.books.filter(b => b.status !== 'returned');
  }

  get returnedBooks(): BorrowedBook[] {
    return this.books.filter(b => b.status === 'returned');
  }

  get sortedBooks(): BorrowedBook[] {
    // Pending/overdue books first, then returned
    return [...this.pendingBooks, ...this.returnedBooks];
  }

  isBookSelected(bookId: string): boolean {
    return this.selectedBooks().has(bookId);
  }

  toggleBookSelection(bookId: string): void {
    const current = new Set(this.selectedBooks());
    if (current.has(bookId)) {
      current.delete(bookId);
    } else {
      current.add(bookId);
    }
    this.selectedBooks.set(current);
  }

  onProcessReturn(book: BorrowedBook): void {
    this.processReturn.emit(book);
  }

  onQuickReturnAll(): void {
    this.quickReturnAll.emit();
  }

  onSelectAll(): void {
    this.selectAll.emit();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'overdue': return 'status--overdue';
      case 'returned': return 'status--returned';
      default: return 'status--pending';
    }
  }

  getStatusLabel(book: BorrowedBook): string {
    if (book.status === 'returned') {
      return `Đã trả ${book.returnDate}`;
    }
    if (book.overdueDays && book.overdueDays > 0) {
      return `Quá hạn ${book.overdueDays} ngày`;
    }
    return 'Chưa trả (Đúng hạn)';
  }

  getDamageLabel(condition: string): string {
    switch (condition) {
      case 'damaged-light': return 'rách góc bìa';
      case 'damaged-heavy': return 'hư hỏng nặng';
      case 'damaged-unusable': return 'không dùng được';
      case 'lost': return 'mất sách';
      default: return 'hư hỏng';
    }
  }

  coverSrc(book: BorrowedBook): string {
    return ImageUtils.toImageSrc(book?.cover);
  }
}
