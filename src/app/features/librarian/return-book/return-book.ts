import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@core/services/toast.service';

import { ReturnBookHeaderComponent } from './return-book-header/return-book-header';
import { ReturnBookRecordCardComponent, RecordCardData } from './return-book-record-card/return-book-record-card';
import { ReturnBookTableComponent, BorrowedBook } from './return-book-table/return-book-table';
import { ReturnBookFineScheduleComponent } from './return-book-fine-schedule/return-book-fine-schedule';
import { ReturnBookTipsComponent } from './return-book-tips/return-book-tips';
import { ReturnBookModalComponent, ReturnModalData } from './return-book-modal/return-book-modal';

@Component({
  selector: 'app-return-book-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReturnBookHeaderComponent,
    ReturnBookRecordCardComponent,
    ReturnBookTableComponent,
    ReturnBookFineScheduleComponent,
    ReturnBookTipsComponent,
    ReturnBookModalComponent,
  ],
  templateUrl: './return-book.html',
  styleUrls: ['./return-book.scss'],
})
export class ReturnBookPage {
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  // ===== State =====
  searchKeyword = signal('');
  currentRecord = signal<RecordCardData | null>(null);
  borrowedBooks = signal<BorrowedBook[]>([]);
  autoPrintEnabled = signal(true);
  selectedBook = signal<BorrowedBook | null>(null);
  isModalOpen = signal(false);

  // ===== Computed =====
  get currentLibrarian(): { name: string; role: string } {
    const user = this.authService.user;
    return {
      name: user?.username ?? '',
      role: 'Thủ thư',
    };
  }

  get hasRecord(): boolean {
    return this.currentRecord() !== null;
  }

  get totalBooks(): number {
    return this.borrowedBooks().length;
  }

  get pendingBooks(): BorrowedBook[] {
    return this.borrowedBooks().filter(b => b.status !== 'returned');
  }

  constructor() {
    // Load sample data on init (demo mode)
    this.loadSampleData();
  }

  // ===== Search =====
  onSearchKeywordChange(keyword: string): void {
    this.searchKeyword.set(keyword);
  }

  onLoadRecord(): void {
    // TODO: Call API to load borrow record by keyword
    console.log('Load record:', this.searchKeyword());
    
    // Demo: Load sample data
    this.loadSampleData();
  }

  onRefresh(): void {
    this.searchKeyword.set('');
    this.currentRecord.set(null);
    this.borrowedBooks.set([]);
  }

  // ===== Modal =====
  onProcessReturn(book: BorrowedBook): void {
    this.selectedBook.set(book);
    this.isModalOpen.set(true);
  }

  onQuickReturnAll(): void {
    // Quick return all books without penalty
    console.log('Quick return all');
    this.toast.info('Đang xử lý trả nhanh tất cả sách...');
  }

  onSelectAll(): void {
    // Select all pending books
    console.log('Select all');
  }

  onModalClose(): void {
    this.isModalOpen.set(false);
    this.selectedBook.set(null);
  }

  onModalConfirm(data: ReturnModalData): void {
    console.log('Confirm return:', data);
    
    // Update the book's status to returned
    const books = this.borrowedBooks();
    const updatedBooks = books.map(b => {
      if (b.id === data.book.id) {
        return {
          ...b,
          status: 'returned' as const,
          returnDate: new Date().toISOString().split('T')[0],
          condition: data.bookCondition,
          damageNote: data.note,
        };
      }
      return b;
    });
    this.borrowedBooks.set(updatedBooks);

    // Show success toast
    this.toast.success(`Đã xác nhận trả sách "${data.book.title}"${data.totalFine > 0 ? ` và thu ${this.formatCurrency(data.totalFine)}` : ''}`);

    // Close modal
    this.isModalOpen.set(false);
    this.selectedBook.set(null);
  }

  onAutoPrintChange(enabled: boolean): void {
    this.autoPrintEnabled.set(enabled);
  }

  // ===== Navigation =====
  onRefreshHeader(): void {
    this.onRefresh();
  }

  onHistory(): void {
    console.log('View shift history');
  }

  // ===== Demo Data =====
  private loadSampleData(): void {
    // Sample record data
    this.currentRecord.set({
      recordId: 'PM-2025-0895',
      recordCode: 'PM-2025-0895',
      createdAt: '2025-02-05T09:15:00',
      status: 'overdue',
      overdueDays: 5,
      memberName: 'Lê Minh Tuấn',
      memberCode: 'MBR-2025-089',
      memberRole: 'GV Khoa CNTT',
      phone: '0904 888 777',
      email: 'tuan.lm@daihoctritue.edu.vn',
      borrowDate: '2025-02-05',
      dueDate: '2025-02-19',
      borrowDays: 14,
      totalBooks: 3,
      returnedCount: 1,
      librarianName: 'Nguyễn Thị Lan',
    });

    // Sample books
    this.borrowedBooks.set([
      {
        id: '1',
        number: 1,
        title: 'Vũ Trụ Trong Vỏ Hạt Dẻ',
        author: 'Stephen Hawking',
        publisher: 'NXB Trẻ (2021)',
        coverUrl: 'https://picsum.photos/seed/book1/96/128',
        barcode: 'LIB-VL-0210',
        price: 120000,
        shelf: 'Kệ VL-A2-04',
        status: 'overdue',
        overdueDays: 5,
        condition: 'damaged-light',
        damageNote: 'Báo rách góc bìa sau',
      },
      {
        id: '2',
        number: 2,
        title: 'Nhà Giả Kim',
        author: 'Paulo Coelho',
        publisher: 'NXB Hội Nhà Văn',
        coverUrl: 'https://picsum.photos/seed/book2/96/128',
        barcode: 'LIB-VH-0145',
        price: 85000,
        shelf: 'Kệ VH-B1-02',
        status: 'overdue',
        overdueDays: 5,
      },
      {
        id: '3',
        number: 3,
        title: 'Kinh Tế Học Hài Hước',
        author: 'Steven D. Levitt & Stephen J. Dubner',
        publisher: 'NXB Kinh Tế',
        coverUrl: 'https://picsum.photos/seed/book3/96/128',
        barcode: 'LIB-KT-0921',
        price: 150000,
        shelf: 'Kệ KT-C3-01',
        status: 'returned',
        returnDate: '2025-02-18',
        returnedBy: 'Nguyễn Thị Lan',
        condition: 'good',
      },
    ]);
  }

  // ===== Helpers =====
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  }
}
