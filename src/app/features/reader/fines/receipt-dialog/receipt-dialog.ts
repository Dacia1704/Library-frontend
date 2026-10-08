import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FinePayment } from '@model/fine';

@Component({
  selector: 'app-receipt-dialog',
  standalone: true,
  imports: [],
  templateUrl: './receipt-dialog.html',
  styleUrls: ['./receipt-dialog.scss'],
})
export class ReceiptDialogComponent {
  @Input() payment: FinePayment | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onPrint = new EventEmitter<void>();

  private dialogEl: HTMLDialogElement | null = null;

  get formattedDate(): string {
    if (!this.payment?.paidAt) return '-';
    const date = new Date(this.payment.paidAt);
    return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  }

  get formattedAmount(): string {
    if (!this.payment?.amount) return '-';
    return new Intl.NumberFormat('vi-VN').format(this.payment.amount) + ' VNĐ';
  }

  show(dialogEl: HTMLDialogElement): void {
    this.dialogEl = dialogEl;
    dialogEl.showModal();
  }

  close(): void {
    if (this.dialogEl) {
      this.dialogEl.close();
    }
    this.onClose.emit();
  }
}
