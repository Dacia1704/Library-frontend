import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FinePayment } from '@model/fine';

@Component({
  selector: 'app-fines-history-table',
  standalone: true,
  imports: [],
  templateUrl: './fines-history-table.html',
  styleUrls: ['./fines-history-table.scss'],
})
export class FinesHistoryTableComponent {
  @Input() payments: FinePayment[] = [];
  @Input() totalPayments: number = 0;
  @Input() totalPaidAmount: number = 0;
  @Output() onViewReceipt = new EventEmitter<FinePayment>();
  @Output() onPrint = new EventEmitter<FinePayment>();

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  }

  formatTime(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount);
  }
}
