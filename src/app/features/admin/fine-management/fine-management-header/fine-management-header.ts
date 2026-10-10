import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fine-management-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fine-management-header.html',
  styleUrl: './fine-management-header.scss',
})
export class FineManagementHeaderComponent {
  @Input() pendingAmount: number = 0;
  @Input() pendingCount: number = 0;
  @Input() paidAmount: number = 0;

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount);
  }
}
