import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinePayment } from '@model/fine';

@Component({
  selector: 'app-fine-payment-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fine-payment-table.html',
  styleUrls: ['./fine-payment-table.scss'],
})
export class FinePaymentTableComponent {
  @Input() payments: FinePayment[] = [];
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;
  @Input() totalElements: number = 0;
  @Input() isLoading: boolean = false;

  @Output() pageChange = new EventEmitter<number>();
  @Output() printReceipt = new EventEmitter<FinePayment>();
  @Output() viewReceipt = new EventEmitter<FinePayment>();

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
    return new Intl.NumberFormat('vi-VN').format(amount);
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

  getReceiptId(id: number): string {
    return `#${id.toString().padStart(4, '0')}`;
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts[parts.length - 1].charAt(0).toUpperCase();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  onPrintReceipt(payment: FinePayment): void {
    this.printReceipt.emit(payment);
  }

  onViewReceipt(payment: FinePayment): void {
    this.viewReceipt.emit(payment);
  }

  getStartIndex(): number {
    return this.currentPage * 10 + 1;
  }

  getEndIndex(): number {
    const end = (this.currentPage + 1) * 10;
    return Math.min(end, this.totalElements);
  }
}
