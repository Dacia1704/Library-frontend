import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingService } from '@core/services/setting.service';
import { ImageUtils } from '@shared/utils/image-utils';

export type BookCondition = 'good' | 'damaged-light' | 'damaged-heavy' | 'damaged-unusable' | 'lost';
export type PaymentMethod = 'cash' | 'vietqr' | 'debt';

export interface ReturnModalData {
  bookCondition: BookCondition;
  totalFine: number;
  paymentMethod: PaymentMethod;
  note: string;
  damageImageUrl?: string;
}

export interface BookForReturn {
  id: string;
  title: string;
  barcode: string;
  cover: string;
  price: number;
  shelfCode: string;
  overdueDays: number;
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
  @Input() set data(value: BookForReturn | null) {
    this._book.set(value);
    this.resetForm();
  }
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<ReturnModalData>();

  private _book = signal<BookForReturn | null>(null);
  
  // Form state
  bookCondition = signal<BookCondition>('good');
  paymentMethod = signal<PaymentMethod>('cash');
  note = signal('');
  damageImageUrl = signal<string | null>(null);

  // Fine rates from settings
  private get overdueFinePerDay(): number {
    return SettingService.getFineOverduePerDay();
  }

  private get damagedLightRate(): number {
    return SettingService.getFineDamagedLightRate();
  }

  private get damagedHeavyRepairableRate(): number {
    return SettingService.getFineDamagedHeavyRepairableRate();
  }

  private get damagedHeavyIrreparableRate(): number {
    return SettingService.getFineDamagedHeavyIrreparableRate();
  }

  private get lostRate(): number {
    return SettingService.getFineLostRate();
  }

  get book(): BookForReturn | null {
    return this._book();
  }

  get overdueDays(): number {
    return this._book()?.overdueDays ?? 0;
  }

  get overdueFine(): number {
    return this.overdueDays * this.overdueFinePerDay;
  }

  get conditionFine(): number {
    const price = this._book()?.price ?? 0;
    
    switch (this.bookCondition()) {
      case 'damaged-light':
        return price * this.damagedLightRate;
      case 'damaged-heavy':
        return price * this.damagedHeavyRepairableRate;
      case 'damaged-unusable':
        return price * this.damagedHeavyIrreparableRate;
      case 'lost':
        return price * this.lostRate;
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
      { value: 'damaged-unusable', label: 'Hư hỏng nặng - không dùng được (100%)', description: 'Mất trang nội dung, ướt sũng hoặc biến dạng' },
      { value: 'lost', label: 'Làm mất sách (100%)', description: 'Không thể hoàn trả bản gốc' },
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
    const data: ReturnModalData = {
      bookCondition: this.bookCondition(),
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
    const price = this._book()?.price ?? 0;
    
    switch (this.bookCondition()) {
      case 'damaged-light':
        return `${this.damagedLightRate * 100}% × ${this.formatCurrency(price)} (Giá bìa)`;
      case 'damaged-heavy':
        return `${this.damagedHeavyRepairableRate * 100}% × ${this.formatCurrency(price)} (Giá bìa)`;
      case 'damaged-unusable':
        return `${this.damagedHeavyIrreparableRate * 100}% × ${this.formatCurrency(price)} (Giá bìa)`;
      case 'lost':
        return `${this.lostRate * 100}% × ${this.formatCurrency(price)} (Giá bìa)`;
      default:
        return '';
    }
  }

  coverSrc(book: BookForReturn): string {
    return ImageUtils.toImageSrc(book?.cover);
  }
}
