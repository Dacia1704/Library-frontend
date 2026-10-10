import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingService } from '@core/services/setting.service';

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

  // Fine rates from settings
  private get overdueFinePerDay(): number {
    return SettingService.getFineOverduePerDay();
  }

  private get damagedLightRate(): number {
    return SettingService.getFineDamagedLightRate();
  }

  private get damagedHeavyRepairableRate(): number {
    return SettingService.getFineDamagedHeavyRepairableRate();
  }

  private get damagedHeavyIrreparableRate(): number {
    return SettingService.getFineDamagedHeavyIrreparableRate();
  }

  private get lostRate(): number {
    return SettingService.getFineLostRate();
  }

  get fineTiers(): FineTier[] {
    return [
      {
        number: 1,
        title: 'Nộp muộn / Trễ hạn',
        description: 'Tính theo từng ngày quá hạn',
        rate: `${this.formatCurrency(this.overdueFinePerDay)} / ngày`,
      },
      {
        number: 2,
        title: 'Hư hỏng nhẹ',
        description: 'Rách góc bìa, gập gáy, vẽ bẩn nhẹ',
        rate: `${this.formatPercentage(this.damagedLightRate)} giá sách`,
      },
      {
        number: 3,
        title: 'Hư hỏng nặng (còn sửa)',
        description: 'Bung chỉ gáy, rách trang nhiều',
        rate: `${this.formatPercentage(this.damagedHeavyRepairableRate)} giá sách`,
      },
      {
        number: 4,
        title: 'Hư hỏng không dùng được',
        description: 'Mất trang nội dung, ướt sũng, mốc',
        rate: `${this.formatPercentage(this.damagedHeavyIrreparableRate)} giá sách`,
        additionalInfo: '+10.000đ phục hồi',
      },
      {
        number: 5,
        title: 'Làm mất sách',
        description: 'Không thể hoàn trả bản gốc',
        rate: `${this.formatPercentage(this.lostRate)} giá sách`,
        additionalInfo: '+20.000đ biên mục',
        isHighlight: true,
      },
    ];
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  }

  private formatPercentage(rate: number): string {
    return `${rate * 100}%`;
  }
}
