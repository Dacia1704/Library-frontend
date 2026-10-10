import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Fine, FINE_REASON_LABELS, FineReason } from '@model/fine/fine.model';

@Component({
  selector: 'app-receive-fine-fine-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receive-fine-fine-list.html',
  styleUrls: ['./receive-fine-fine-list.scss'],
})
export class ReceiveFineFineListComponent {
  @Input() fines: Fine[] = [];
  @Input() unpaidTotal = 0;
  @Input() fineOverduePerDay = 0;

  getReasonLabel(reason: FineReason): string {
    return FINE_REASON_LABELS[reason] || reason;
  }

  getReasonClass(reason: FineReason): string {
    switch (reason) {
      case 'OVERDUE':
        return 'reason--overdue';
      case 'LOST':
        return 'reason--lost';
      case 'DAMAGED_LIGHT':
        return 'reason--damage-light';
      case 'DAMAGED_HEAVY_REPAIRABLE':
        return 'reason--damage-heavy';
      case 'DAMAGED_HEAVY_IRREPARABLE':
        return 'reason--damage-heavy';
      default:
        return '';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
