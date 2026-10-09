import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

type PaymentMethod = 'CASH' | 'VIETQR';

@Component({
  selector: 'app-receive-fine-payment-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receive-fine-payment-form.html',
  styleUrls: ['./receive-fine-payment-form.scss'],
})
export class ReceiveFinePaymentFormComponent {
  @Input() unpaidAmount = 0;
  @Input() paymentAmount = 0;
  @Input() paymentNote = '';
  @Input() paymentMethod: PaymentMethod = 'CASH';
  @Input() autoPrint = true;
  @Input() autoUnlock = true;

  @Output() paymentAmountChange = new EventEmitter<number>();
  @Output() paymentNoteChange = new EventEmitter<string>();
  @Output() paymentMethodChange = new EventEmitter<PaymentMethod>();
  @Output() presetAmount = new EventEmitter<number>();
  @Output() submit = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();

  get isValidAmount(): boolean {
    return this.paymentAmount > 0 && this.paymentAmount <= this.unpaidAmount;
  }

  get amountError(): string | null {
    if (this.paymentAmount > this.unpaidAmount) {
      return 'Số tiền vượt quá dư nợ';
    }
    return null;
  }

  onAmountChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value.replace(/[^\d]/g, '')) || 0;
    this.paymentAmountChange.emit(value);
  }

  onNoteChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.paymentNoteChange.emit(textarea.value);
  }

  setPresetFull(): void {
    this.presetAmount.emit(this.unpaidAmount);
  }

  setPresetHalf(): void {
    this.presetAmount.emit(Math.floor(this.unpaidAmount / 2));
  }

  setPresetCustom(amount: number): void {
    this.presetAmount.emit(amount);
  }

  selectCash(): void {
    this.paymentMethodChange.emit('CASH');
  }

  selectVietQR(): void {
    this.paymentMethodChange.emit('VIETQR');
  }

  onAutoPrintChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    // TODO: emit if needed
  }

  onAutoUnlockChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    // TODO: emit if needed
  }

  handleSubmit(): void {
    if (this.isValidAmount) {
      this.submit.emit();
    }
  }

  handleReset(): void {
    this.reset.emit();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount);
  }

  formatPresetAmount(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(Math.floor(amount)) + 'đ';
  }

  get halfAmount(): number {
    return Math.floor(this.unpaidAmount / 2);
  }

  formatInputAmount(): string {
    return new Intl.NumberFormat('vi-VN').format(this.paymentAmount);
  }
}
