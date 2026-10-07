import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SettingService } from '../../../../core/services/setting.service';

@Component({
  selector: 'app-book-borrow-rules',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="rules-container">
      <div class="rules-header">
        <mat-icon color="primary">policy</mat-icon>
        <h2>Quy chế mượn đọc ấn phẩm tại thư viện</h2>
      </div>
      
      <div class="rules-grid">
        <div class="rule-card">
          <mat-icon class="rule-icon">event_available</mat-icon>
          <div class="rule-content">
            <strong>Thời hạn mượn:</strong>
            Tối đa {{ SettingService.getMaxBorrowDays() }} ngày kể từ ngày bắt đầu mượn. Lưu ý trả sách đúng hạn nhé!
          </div>
        </div>

        <div class="rule-card">
          <mat-icon class="rule-icon">filter_3</mat-icon>
          <div class="rule-content">
            <strong>Hạn mức thẻ:</strong>
            Mượn đồng thời tối đa {{ SettingService.getMaxBookBorrow() }} cuốn/thẻ bạn đọc tiêu chuẩn.
          </div>
        </div>

        <div class="rule-card">
          <mat-icon class="rule-icon">shield_lock</mat-icon>
          <div class="rule-content">
            <strong>Bảo quản ấn phẩm:</strong>
            Bồi hoàn hoặc phục hồi theo quy chế quản lý thư viện hiện hành.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rules-container { background: #eff4ff; padding: 16px; border-radius: 8px; display: flex; flex-direction: column; gap: 12px; }
    .rules-header { display: flex; align-items: center; gap: 8px; h2 { font-size: 14px; font-weight: 600; color: #0b1c30; margin: 0; } mat-icon { font-size: 20px; width: 20px; height: 20px; } }
    .rules-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
    
    @media (min-width: 768px) {
      .rules-grid { grid-template-columns: repeat(3, 1fr); }
    }

    .rule-card { background: #ffffff; padding: 12px; border-radius: 6px; display: flex; align-items: flex-start; gap: 8px; }
    .rule-icon { color: #006a61; font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px; }
    .rule-content { font-size: 12px; color: #444653; line-height: 1.5; strong { display: block; color: #0b1c30; font-weight: 600; margin-bottom: 2px; } }
  `]
})
export class BookBorrowRules {
  SettingService = SettingService;
}