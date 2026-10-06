import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile-notice-banner',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="banner">
      <div class="accent-line"></div>
      <div class="icon-wrap"><mat-icon>info</mat-icon></div>
      <div class="content">
        <div class="text">
          <h3>Chế độ hiển thị bảo mật thông tin</h3>
          <p>Cần thay đổi thông tin cá nhân hoặc gia hạn thẻ? Vui lòng xuất trình giấy tờ tùy thân tại quầy thủ thư để được cập nhật dữ liệu.</p>
        </div>
        <div class="desk-pill"><mat-icon>support_agent</mat-icon> Bàn thủ thư số 2</div>
      </div>
    </div>
  `,
  styles: [`
    .banner { position: relative; background: #eff4ff; border-radius: 12px; padding: 16px; display: flex; gap: 16px; align-items: flex-start; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .accent-line { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: #00288e; }
    .icon-wrap { background: #fff; width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #00288e; box-shadow: 0 1px 2px rgba(0,0,0,0.05); flex-shrink: 0; }
    .content { flex: 1; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; }
    .text h3 { margin: 0; font-size: 16px; font-weight: 600; color: #0b1c30; }
    .text p { margin: 4px 0 0 0; font-size: 14px; color: #444653; }
    .desk-pill { display: flex; align-items: center; gap: 6px; background: #e5eeff; color: #00288e; padding: 6px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; mat-icon { font-size: 18px; width: 18px; height: 18px; } }
  `]
})
export class ProfileNoticeBannerComponent {}