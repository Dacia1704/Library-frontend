import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Fine, FINE_REASON_LABELS, FineReason } from '@model/fine';

@Component({
  selector: 'app-fines-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fines-table.html',
  styleUrls: ['./fines-table.scss'],
})
export class FinesTableComponent {
  @Input() fines: Fine[] = [];

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

  getReasonLabel(reason: FineReason): string {
    return FINE_REASON_LABELS[reason] || reason;
  }

  getReasonClass(reason: FineReason): string {
    const classMap: Record<FineReason, string> = {
      OVERDUE: 'fines-table__reason-pill--amber',
      LOST: 'fines-table__reason-pill--red',
      DAMAGED_LIGHT: 'fines-table__reason-pill--blue',
      DAMAGED_HEAVY_REPAIRABLE: 'fines-table__reason-pill--orange',
      DAMAGED_HEAVY_IRREPARABLE: 'fines-table__reason-pill--rose',
    };
    return classMap[reason] || '';
  }
}
