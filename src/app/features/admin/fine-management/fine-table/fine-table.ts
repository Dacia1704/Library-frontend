import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

interface Fine {
  id: string;
  code: string;
  source: string;
  patronName: string;
  patronCard: string;
  patronType: string;
  bookTitle: string;
  slipCode: string;
  reason: string;
  reasonDetail: string;
  amount: number;
  status: 'pending' | 'paid' | 'waived' | 'locked';
  statusText: string;
  createdDate: string;
  createdTime: string;
}

@Component({
  selector: 'app-fine-table',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './fine-table.html',
  styleUrl: './fine-table.scss',
})
export class FineTableComponent {

  readonly fines: Fine[] = [
    {
      id: '1',
      code: 'FP-2025-0142',
      source: 'Tự động (Cronjob)',
      patronName: 'Trần Hoàng Nam',
      patronCard: 'TV-882319',
      patronType: 'Sinh viên',
      bookTitle: 'Lập trình hệ thống phân tán nâng cao',
      slipCode: '#BR-2025-0810',
      reason: 'overdue',
      reasonDetail: 'Quá hạn 05 ngày',
      amount: 25000,
      status: 'pending',
      statusText: 'Chưa thanh toán',
      createdDate: '24/10/2025',
      createdTime: '08:00',
    },
    {
      id: '2',
      code: 'FP-2025-0139',
      source: 'Thủ thư: Nguyễn Tú',
      patronName: 'Đặng Minh Châu',
      patronCard: 'TV-551020',
      patronType: 'Giảng viên',
      bookTitle: 'Lịch sử triết học phương Tây tập II',
      slipCode: '#BR-2025-0792',
      reason: 'damage',
      reasonDetail: 'Hư hỏng bìa trước',
      amount: 50000,
      status: 'paid',
      statusText: 'Đã thanh toán',
      createdDate: '23/10/2025',
      createdTime: '15:42',
    },
    {
      id: '3',
      code: 'FP-2025-0128',
      source: 'Hội đồng thư viện',
      patronName: 'Vũ Thị An',
      patronCard: 'TV-994112',
      patronType: 'Nghiên cứu sinh',
      bookTitle: 'Giáo trình Vi điện tử & Thiết kế vi mạch...',
      slipCode: '#BR-2025-0651',
      reason: 'lost',
      reasonDetail: 'Báo mất tài liệu',
      amount: 0,
      status: 'waived',
      statusText: 'Admin đã miễn giảm',
      createdDate: '21/10/2025',
      createdTime: '11:15',
    },
  ];

  formatAmount(amount: number): string {
    return amount.toLocaleString('vi-VN');
  }
}
