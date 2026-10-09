import { Component, EventEmitter, Input, Output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BorrowedBook } from '../return-book-table/return-book-table';

export type BookCondition = 'good' | 'damaged-light' | 'damaged-heavy' | 'damaged-unusable' | 'lost';
export type PaymentMethod = 'cash' | 'vietqr' | 'debt';

export interface ReturnModalData {
  book: BorrowedBook;
  overdueDays: number;
  overdueFine: number;
  bookCondition: BookCondition;
  conditionFine: number;
  totalFine: number;
  paymentMethod: PaymentMethod;
  note: string;
  damageImageUrl?: string;
}

@Component({
  selector: 'app-return-book-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './return-book-modal.html',
  styleUrls: ['./return-book-modal.scss'],
})
export class ReturnBookModalComponent {
  @Input() isOpen = false;
  @Input() set data(value: BorrowedBook | null) {
    this._book.set(value);
    this.resetForm();
  }
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<ReturnModalData>();

  private _book = signal<BorrowedBook | null>(null);
  
  // Form state
  bookCondition = signal<BookCondition>('good');
  paymentMethod = signal<PaymentMethod>('cash');
  note = signal('');
  damageImageUrl = signal<string | null>(null);

  // Fine rates
  readonly OVERDUE_FINE_PER_DAY = 5000;
  readonly DAMAGED_LIGHT_RATE = 0.20;
  readonly DAMAGED_HEAVY_RATE = 0.50;
  readonly DAMAGED_UNUSABLE_RATE = 1.0;
  readonly LOST_RATE = 1.0;
  readonly RECOVERY_FEE = 10000;
  readonly CATALOG_FEE = 20000;

  get book(): BorrowedBook | null {
    return this._book();
  }

  get overdueDays(): number {
    return this._book()?.overdueDays ?? 0;
  }

  get overdueFine(): number {
    return this.overdueDays * this.OVERDUE_FINE_PER_DAY;
  }

  get conditionFine(): number {
    const book = this._book();
    if (!book) return 0;
    const price = book.price;
    
    switch (this.bookCondition()) {
      case 'damaged-light':
        return price * this.DAMAGED_LIGHT_RATE;
      case 'damaged-heavy':
        return price * this.DAMAGED_HEAVY_RATE;
      case 'damaged-unusable':
        return price * this.DAMAGED_UNUSABLE_RATE + this.RECOVERY_FEE;
      case 'lost':
        return price * this.LOST_RATE + this.CATALOG_FEE;
      default:
        return 0;
    }
  }

  get totalFine(): number {
    return this.overdueFine + this.conditionFine;
  }

  get conditionOptions(): { value: BookCondition; label: string; description: string }[] {
    return [
      { value: 'good', label: 'Bình thường (không phạt)', description: '' },
      { value: 'damaged-light', label: 'Hư hỏng nhẹ (20%)', description: 'Rách góc, gập nếp nhẹ' },
      { value: 'damaged-heavy', label: 'Hư hỏng nặng - còn sửa (50%)', description: 'Bung gáy, rách nhiều' },
      { value: 'damaged-unusable', label: 'Hư hỏng nặng - không dùng được (100% + phí)', description: 'Mất trang nội dung, ướt sũng hoặc biến dạng' },
      { value: 'lost', label: 'Làm mất sách', description: 'Không thể hoàn trả bản gốc' },
    ];
  }

  get paymentMethods(): { value: PaymentMethod; label: string }[] {
    return [
      { value: 'cash', label: 'Tiền mặt tại quầy' },
      { value: 'vietqr', label: 'Quét mã VietQR' },
      { value: 'debt', label: 'Ghi nợ tài khoản' },
    ];
  }

  setBookCondition(condition: BookCondition): void {
    this.bookCondition.set(condition);
  }

  setPaymentMethod(method: PaymentMethod): void {
    this.paymentMethod.set(method);
  }

  onNoteChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.note.set(textarea.value);
  }

  onUploadImage(event: Event): void {
    console.log('Upload image:', event);
  }

  onPreviewReceipt(): void {
    console.log('Preview receipt');
  }

  onConfirm(): void {
    const book = this._book();
    if (!book) return;

    const data: ReturnModalData = {
      book,
      overdueDays: this.overdueDays,
      overdueFine: this.overdueFine,
      bookCondition: this.bookCondition(),
      conditionFine: this.conditionFine,
      totalFine: this.totalFine,
      paymentMethod: this.paymentMethod(),
      note: this.note(),
      damageImageUrl: this.damageImageUrl() ?? undefined,
    };

    this.confirm.emit(data);
  }

  onClose(): void {
    this.close.emit();
  }

  private resetForm(): void {
    this.bookCondition.set('good');
    this.paymentMethod.set('cash');
    this.note.set('');
    this.damageImageUrl.set(null);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  }

  getConditionLabel(condition: BookCondition): string {
    const option = this.conditionOptions.find(o => o.value === condition);
    return option?.label ?? '';
  }

  getConditionCalcDesc(): string {
    const book = this._book();
    if (!book) return '';
    const price = book.price;
    
    switch (this.bookCondition()) {
      case 'damaged-light':
        return `20% × ${this.formatCurrency(price)} (Giá bìa)`;
      case 'damaged-heavy':
        return `50% × ${this.formatCurrency(price)} (Giá bìa)`;
      case 'damaged-unusable':
        return `100% × ${this.formatCurrency(price)} + ${this.formatCurrency(this.RECOVERY_FEE)}`;
      case 'lost':
        return `100% × ${this.formatCurrency(price)} + ${this.formatCurrency(this.CATALOG_FEE)}`;
      default:
        return '';
    }
  }
}
