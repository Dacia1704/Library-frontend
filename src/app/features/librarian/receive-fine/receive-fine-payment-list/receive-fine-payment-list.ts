import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinePayment } from '@model/fine/fine-payment.model';

@Component({
  selector: 'app-receive-fine-payment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receive-fine-payment-list.html',
  styleUrls: ['./receive-fine-payment-list.scss'],
})
export class ReceiveFinePaymentListComponent {
  @Input() payments: FinePayment[] = [];
  @Input() currentPage = 0;
  @Input() totalPages = 0;
  @Input() totalElements = 0;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  get hasPrevious(): boolean {
    return this.currentPage > 0;
  }

  get hasNext(): boolean {
    return this.currentPage < this.totalPages - 1;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  }

  formatDate(dateStr: string): { date: string; time: string } {
    if (!dateStr) return { date: '', time: '' };
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return {
      date: `${day}/${month}/${year}`,
      time: `${hours}:${minutes}`,
    };
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.split(' ');
    return parts[parts.length - 1].charAt(0).toUpperCase();
  }

  getReceiptId(id: number): string {
    return `BL-${id.toString().padStart(4, '0')}`;
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  printReceipt(payment: FinePayment): void {
    console.log('Print receipt:', payment.id);
  }

  viewReceipt(payment: FinePayment): void {
    console.log('View receipt:', payment.id);
  }
}
