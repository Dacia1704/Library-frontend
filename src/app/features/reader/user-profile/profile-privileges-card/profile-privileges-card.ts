import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Member } from '@model/member/member.model';

@Component({
  selector: 'app-profile-privileges-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="card card-base">
      <div class="header">
        <div class="title"><mat-icon>assignment_turned_in</mat-icon> Đặc quyền mượn trả</div>
        <span class="tag">HẠNG THẺ A1</span>
      </div>

      <div class="metrics-grid">
        <div class="metric-box">
          <span class="lbl">Hạn mức mượn</span>
          <div class="val-row"><span class="num primary">03</span> <span class="unit">cuốn / lần</span></div>
          <div class="progress-bar"><div class="fill" style="width: 33%;"></div></div>
          <span class="sub-lbl">Đang dùng: 01 / 03</span>
        </div>
        <div class="metric-box">
          <span class="lbl">Tiền phạt phát sinh</span>
          <div class="val-row"><span class="num secondary">0</span> <span class="unit secondary-bold">VNĐ</span></div>
          <div class="status-ok"><mat-icon>check_circle</mat-icon> Không nợ đọng</div>
        </div>
      </div>

      <div class="borrow-strip">
        <div class="book-info">
          <mat-icon>auto_stories</mat-icon>
          <div class="text-group">
            <strong>Mắt Biếc (Nguyễn Nhật Ánh)</strong>
            <span>Hạn trả: 05/11/2026</span>
          </div>
        </div>
        <span class="badge">Đang giữ</span>
      </div>

      <div class="footer-strip">
        <div class="history"><mat-icon>sentiment_satisfied</mat-icon> Lịch sử vi phạm: <strong>0 lần</strong></div>
        <a class="link">Chi tiết phiếu mượn</a>
      </div>
    </div>
  `,
  styles: [`
    .card-base { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between; height: 100%; box-sizing: border-box;}
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .title { display: flex; align-items: center; gap: 6px; font-size: 16px; font-weight: 700; color: #0b1c30; mat-icon { color: #00288e; font-size: 20px; width: 20px; height: 20px; } }
    .tag { font-family: monospace; font-size: 11px; color: #444653; }
    
    .metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
    .metric-box { background: #eff4ff; padding: 16px; border-radius: 8px; display: flex; flex-direction: column; }
    .lbl { font-size: 12px; color: #444653; margin-bottom: 4px; }
    .val-row { display: flex; align-items: baseline; gap: 4px; }
    .num { font-size: 32px; font-weight: 700; line-height: 1; }
    .num.primary { color: #00288e; } .num.secondary { color: #006a61; }
    .unit { font-size: 12px; color: #444653; } .unit.secondary-bold { color: #006a61; font-weight: 600; }
    
    .progress-bar { width: 100%; height: 6px; background: #dce9ff; border-radius: 99px; margin: 8px 0 6px; overflow: hidden; }
    .fill { height: 100%; background: #00288e; border-radius: 99px; }
    .sub-lbl { font-size: 11px; color: #757684; }
    
    .status-ok { display: flex; align-items: center; gap: 4px; color: #006a61; font-size: 12px; font-weight: 500; margin-top: auto; mat-icon { font-size: 16px; width: 16px; height: 16px; } }
    
    .borrow-strip { background: rgba(220,233,255,0.6); padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
    .book-info { display: flex; gap: 8px; align-items: center; mat-icon { color: #00288e; font-size: 18px; width: 18px; height: 18px; } }
    .text-group { display: flex; flex-direction: column; strong { font-size: 13px; color: #0b1c30; } span { font-size: 11px; color: #444653; } }
    .borrow-strip .badge { background: #fff; color: #00288e; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    
    .footer-strip { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 8px; }
    .history { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #444653; mat-icon { color: #006a61; font-size: 16px; width: 16px; height: 16px; } strong { color: #0b1c30; } }
    .link { font-size: 12px; color: #00288e; font-weight: 500; cursor: pointer; } .link:hover { text-decoration: underline; }
  `]
})
export class ProfilePrivilegesCardComponent {
  @Input({ required: true }) member!: Member;
}