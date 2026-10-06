import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile-rules',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="card card-base">
      <div class="main-content">
        <div class="header">
          <div class="icon bg-surface"><mat-icon>verified_user</mat-icon></div>
          <div>
            <h3>Bảo vệ thông tin & Trách nhiệm độc giả</h3>
            <span class="sub">Chính sách tuân thủ quy chế phòng đọc và mượn sách</span>
          </div>
        </div>

        <div class="rules-grid">
          <div class="rule-item">
            <mat-icon>check_circle</mat-icon>
            <div class="text">
              <strong>Không cho mượn thẻ</strong>
              <p>Thẻ thư viện chỉ cấp cho chính chủ. Không chuyển giao thẻ cho người khác.</p>
            </div>
          </div>
          <div class="rule-item">
            <mat-icon>check_circle</mat-icon>
            <div class="text">
              <strong>Bảo quản ấn phẩm</strong>
              <p>Độc giả có trách nhiệm giữ gìn sách nguyên vẹn, không viết vẽ lên tài liệu.</p>
            </div>
          </div>
          <div class="rule-item">
            <mat-icon>check_circle</mat-icon>
            <div class="text">
              <strong>Thời hạn trả sách</strong>
              <p>Thời hạn mượn thông thường là 14 ngày. Có thể xin gia hạn tối đa 01 lần.</p>
            </div>
          </div>
          <div class="rule-item">
            <mat-icon>check_circle</mat-icon>
            <div class="text">
              <strong>Đồng bộ dữ liệu</strong>
              <p>Khi thay đổi thông tin liên hệ, chủ động thông báo cho thủ thư để cập nhật.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-note">
        <span>Mã số lưu kho thẻ: <span class="mono">LIB-DOC-8942-X</span></span>
        <span class="date">Cập nhật lần cuối: 15/09/2023 lúc 08:30</span>
      </div>
    </div>
  `,
  styles: [`
    .card-base { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between; height: 100%; box-sizing: border-box;}
    .header { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; h3 { margin: 0; font-size: 16px; font-weight: 700; color: #0b1c30; } .sub { font-size: 12px; color: #444653; } }
    .icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #00288e; mat-icon { font-size: 18px; width: 18px; height: 18px; } }
    .bg-surface { background: #dce9ff; }
    
    .rules-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    .rule-item { background: rgba(239,244,255,0.4); padding: 12px; border-radius: 8px; display: flex; align-items: flex-start; gap: 8px; }
    .rule-item mat-icon { color: #006a61; font-size: 20px; width: 20px; height: 20px; flex-shrink: 0; margin-top: 2px; }
    .rule-item .text strong { display: block; font-size: 14px; font-weight: 600; color: #0b1c30; }
    .rule-item .text p { margin: 4px 0 0 0; font-size: 12px; color: #444653; line-height: 1.4; }
    
    .footer-note { display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px solid transparent; font-size: 11px; color: #444653; }
    .mono { font-family: monospace; color: #0b1c30; }
    .date { color: #757684; }
  `]
})
export class ProfileRulesComponent {}