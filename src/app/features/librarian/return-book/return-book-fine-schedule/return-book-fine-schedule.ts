import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FineTier {
  number: number;
  title: string;
  description: string;
  rate: string;
  additionalInfo?: string;
  isHighlight?: boolean;
}

@Component({
  selector: 'app-return-book-fine-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './return-book-fine-schedule.html',
  styleUrls: ['./return-book-fine-schedule.scss'],
})
export class ReturnBookFineScheduleComponent {
  @Input() regulationCode = 'QĐ-TV 14/2024';

  fineTiers: FineTier[] = [
    {
      number: 1,
      title: 'Nộp muộn / Trễ hạn',
      description: 'Tính theo từng ngày quá hạn',
      rate: '5.000 đ / ngày',
    },
    {
      number: 2,
      title: 'Hư hỏng nhẹ',
      description: 'Rách góc bìa, gập gáy, vẽ bẩn nhẹ',
      rate: '20% giá sách',
    },
    {
      number: 3,
      title: 'Hư hỏng nặng (còn sửa)',
      description: 'Bung chỉ gáy, rách trang nhiều',
      rate: '50% giá sách',
    },
    {
      number: 4,
      title: 'Hư hỏng không dùng được',
      description: 'Mất trang nội dung, ướt sũng, mốc',
      rate: '100% giá sách',
      additionalInfo: '+10.000đ phục hồi',
    },
    {
      number: 5,
      title: 'Làm mất sách',
      description: 'Không thể hoàn trả bản gốc',
      rate: '100% giá sách',
      additionalInfo: '+20.000đ biên mục',
      isHighlight: true,
    },
  ];
}
