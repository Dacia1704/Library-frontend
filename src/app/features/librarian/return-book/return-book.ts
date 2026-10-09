import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@core/services/toast.service';
import { BorrowRecordService } from '@core/services/borrow-record.service';
import { BorrowDetailService } from '@core/services/borrow-detail.service';
import { BorrowRecord } from '@model/borrow-record/borrow-record';
import { BorrowDetail } from '@model/borrow-record/borrow-record';
import { FineReason } from '@model/enum/fine-reason.enum';

import { ReturnBookHeaderComponent } from './return-book-header/return-book-header';
import { ReturnBookRecordCardComponent, RecordCardData } from './return-book-record-card/return-book-record-card';
import { ReturnBookTableComponent, BorrowedBook } from './return-book-table/return-book-table';
import { ReturnBookFineScheduleComponent } from './return-book-fine-schedule/return-book-fine-schedule';
import { ReturnBookTipsComponent } from './return-book-tips/return-book-tips';
import { ReturnBookModalComponent, BookCondition, PaymentMethod, BookForReturn } from './return-book-modal/return-book-modal';

@Component({
  selector: 'app-return-book-page',
  standalone: true,
  imports: [
    CommonModule,
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
export class ReturnBookPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly borrowRecordService = inject(BorrowRecordService);
  private readonly borrowDetailService = inject(BorrowDetailService);

  // ===== State =====
  currentRecord = signal<BorrowRecord | null>(null);
  autoPrintEnabled = signal(true);
  selectedBook = signal<BookForReturn | null>(null);
  isModalOpen = signal(false);
  isLoading = signal(false);

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
    return this.currentRecord()?.borrowDetails.length ?? 0;
  }

  get recordCardData(): RecordCardData | null {
    const record = this.currentRecord();
    if (!record) return null;

    const returnedCount = record.borrowDetails.filter(d => d.borrowStatus === 'RETURNED').length;

    return {
      recordId: String(record.id),
      recordCode: `PM-${record.id}`,
      createdAt: record.borrowDate.toISOString(),
      status: record.status,
      overdueDays: record.overdueDays,
      memberName: record.member.user.fullName,
      memberCode: record.member.memberCode,
      memberRole: record.member.user.roleName ?? '',
      phone: record.member.phone ?? '',
      email: record.member.user.email ?? '',
      borrowDate: record.borrowDate.toISOString().split('T')[0],
      dueDate: record.dueDate.toISOString().split('T')[0],
      borrowDays: Math.ceil((record.dueDate.getTime() - record.borrowDate.getTime()) / (1000 * 60 * 60 * 24)),
      totalBooks: record.borrowDetails.length,
      returnedCount,
      librarianName: record.librarian.fullName ?? '',
    };
  }

  get borrowedBooks(): BorrowedBook[] {
    const record = this.currentRecord();
    if (!record) return [];

    return record.borrowDetails.map((detail, index) => ({
      id: String(detail.id),
      number: index + 1,
      title: detail.book.title,
      author: detail.book.authors?.map(a => a.name).join(', ') ?? '',
      publisher: detail.book.publishers?.map(p => p.name).join(', ') ?? '',
      cover: detail.book.cover ?? '',
      barcode: detail.book.bookCode,
      price: Number(detail.book.price) || 0,
      shelf: detail.book.shelf?.code ? `Kệ ${detail.book.shelf.code}` : '',
      status: detail.borrowStatus === 'RETURNED' ? 'returned' : (detail.borrowStatus === 'OVERDUE' ? 'overdue' : 'pending') as 'pending' | 'overdue' | 'returned',
      overdueDays: this.calculateOverdueDays(detail),
      returnDate: detail.returnDate?.toISOString().split('T')[0],
      returnedBy: detail.returnDate ? record.librarian.fullName : undefined,
      condition: undefined,
      damageNote: undefined,
      detail,
    }));
  }

  ngOnInit(): void {
    // Get record ID from route query params
    const recordId = this.route.snapshot.queryParamMap.get('recordId');
    if (recordId) {
      this.loadRecord(Number(recordId));
    }
  }

  loadRecord(id: number): void {
    this.isLoading.set(true);
    this.borrowRecordService.getById(String(id)).subscribe({
      next: (response) => {
        this.currentRecord.set(response.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading record:', err);
        this.toast.error('Không thể tải thông tin phiếu mượn');
        this.isLoading.set(false);
      },
    });
  }

  onRefresh(): void {
    this.currentRecord.set(null);
  }

  // ===== Modal =====
  onProcessReturn(book: BorrowedBook): void {
    // Create BookForReturn from BorrowedBook
    const bookForReturn: BookForReturn = {
      id: book.id,
      title: book.title,
      barcode: book.barcode,
      cover: book.cover,
      price: book.price,
      shelfCode: book.shelf,
      overdueDays: book.overdueDays ?? 0,
    };
    this.selectedBook.set(bookForReturn);
    this.isModalOpen.set(true);
  }

  onQuickReturnAll(): void {
    console.log('Quick return all');
    this.toast.info('Đang xử lý trả nhanh tất cả sách...');
  }

  onSelectAll(): void {
    console.log('Select all');
  }

  onModalClose(): void {
    this.isModalOpen.set(false);
    this.selectedBook.set(null);
  }

  onModalConfirm(data: { bookCondition: BookCondition; totalFine: number; paymentMethod: PaymentMethod; note: string }): void {
    const book = this.selectedBook();
    if (!book) return;

    // Find the original detail from record
    const record = this.currentRecord();
    const detail = record?.borrowDetails.find(d => String(d.id) === book.id);
    if (!detail) return;

    // Build fine requests
    const fineRequests: { reason: FineReason; note?: string }[] = [];

    // 1. Overdue fine if applicable
    if (book.overdueDays > 0) {
      fineRequests.push({
        reason: FineReason.OVERDUE,
        note: `Quá hạn ${book.overdueDays} ngày`,
      });
    }

    // 2. Damage fine based on condition
    if (data.bookCondition !== 'good') {
      const reason = this.getFineReason(data.bookCondition);
      fineRequests.push({
        reason,
        note: data.note,
      });
    }

    // Call API
    this.borrowDetailService.returnBook(book.id, { fineRequests }).subscribe({
      next: () => {
        this.toast.success(`Đã xác nhận trả sách "${book.title}"${data.totalFine > 0 ? ` và thu ${this.formatCurrency(data.totalFine)}` : ''}`);
        
        // Reload record to get updated data
        const recordId = this.currentRecord()?.id;
        if (recordId) {
          this.loadRecord(recordId);
        }

        this.onModalClose();
      },
      error: (err) => {
        console.error('Error returning book:', err);
        this.toast.error('Không thể xác nhận trả sách');
      },
    });
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

  // ===== Helpers =====
  private calculateOverdueDays(detail: BorrowDetail): number {
    const record = this.currentRecord();
    if (!record) return 0;

    // If already returned, check if it was late
    if (detail.returnDate) {
      const diff = detail.returnDate.getTime() - record.dueDate.getTime();
      return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    // Not returned yet
    const today = new Date();
    if (detail.borrowStatus === 'OVERDUE' || today > record.dueDate) {
      const diff = today.getTime() - record.dueDate.getTime();
      return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    return 0;
  }

  private getFineReason(condition: BookCondition): FineReason {
    switch (condition) {
      case 'damaged-light':
        return FineReason.DAMAGED_LIGHT;
      case 'damaged-heavy':
        return FineReason.DAMAGED_HEAVY_REPAIRABLE;
      case 'damaged-unusable':
        return FineReason.DAMAGED_HEAVY_IRREPARABLE;
      case 'lost':
        return FineReason.LOST;
      default:
        return FineReason.DAMAGED_LIGHT;
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  }
}
