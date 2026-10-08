import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FineSummary } from '@model/fine';

@Component({
  selector: 'app-fines-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fines-stats.html',
  styleUrls: ['./fines-stats.scss'],
})
export class FinesStatsComponent {
  @Input() summary: FineSummary | null = null;

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount);
  }
}
