import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Member } from '@model/member/member.model';

@Component({
  selector: 'app-profile-overview-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="card card-base">
      <div class="bg-decoration"></div>
      
      <div class="user-main">
        <div class="avatar-wrap">
          <img [src]="member.user?.avatar || 'assets/default-avatar.png'" alt="Avatar" />
          <div class="status-dot"><span></span></div>
        </div>
        
        <div class="info">
          <div class="badges">
            <span class="badge active"><span class="pulse"></span> Đang hoạt động</span>
            <span class="badge role">{{ member.user?.roleName }}</span>
          </div>
          <h2>{{ member.user?.fullName }}</h2>
          <div class="meta">
            <span class="code"><mat-icon>badge</mat-icon> {{ member.memberCode }}</span>
            <span class="dot">•</span>
            <span class="level"><mat-icon>school</mat-icon> Hội viên học tập & nghiên cứu</span>
          </div>
        </div>
      </div>

      <div class="dates-strip">
        <div class="date-item">
          <div class="icon bg-primary"><mat-icon>calendar_today</mat-icon></div>
          <div class="text">
            <span class="lbl">Ngày kích hoạt thẻ</span>
            <span class="val">{{ member.user?.createdAt | date:'dd/MM/yyyy' }}</span>
          </div>
        </div>
        <div class="date-item">
          <div class="icon bg-secondary"><mat-icon>event_available</mat-icon></div>
          <div class="text">
            <span class="lbl">Hạn dùng thẻ</span>
            <div class="val-group">
              <span class="val">{{ member.cardExpiry | date:'dd/MM/yyyy' }}</span>
              <span class="tag">Còn {{ daysRemaining }} ngày</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-base { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; height: 100%; box-sizing: border-box; }
    .bg-decoration { position: absolute; right: -30px; top: -30px; width: 170px; height: 170px; border-radius: 50%; background: radial-gradient(circle, rgba(221,225,255,0.5) 0%, rgba(255,255,255,0) 70%); pointer-events: none; }
    .user-main { display: flex; gap: 24px; align-items: center; position: relative; z-index: 1; }
    .avatar-wrap { position: relative; flex-shrink: 0; }
    .avatar-wrap img { width: 96px; height: 96px; border-radius: 12px; object-fit: cover; background: #e5eeff; }
    .status-dot { position: absolute; bottom: -4px; right: -4px; width: 24px; height: 24px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
    .status-dot span { width: 14px; height: 14px; background: #006a61; border-radius: 50%; }
    .badges { display: flex; gap: 8px; margin-bottom: 4px; }
    .badge { padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 4px; }
    .badge.active { background: rgba(134,242,228,0.4); color: #006f66; }
    .pulse { width: 6px; height: 6px; background: #006a61; border-radius: 50%; animation: pulse 1.5s infinite; }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
    .badge.role { background: #1e40af; color: #fff; }
    .info h2 { margin: 0; font-size: 24px; font-weight: 700; color: #0b1c30; }
    .meta { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 4px; font-size: 13px; color: #444653; mat-icon { font-size: 16px; width: 16px; height: 16px; } }
    .code { display: flex; align-items: center; gap: 4px; color: #00288e; font-weight: 600; font-family: monospace; }
    .level { display: flex; align-items: center; gap: 4px; }
    
    .dates-strip { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: rgba(239,244,255,0.7); padding: 16px; border-radius: 8px; margin-top: 24px; position: relative; z-index: 1; }
    .date-item { display: flex; gap: 12px; align-items: center; }
    .icon { width: 32px; height: 32px; border-radius: 8px; background: #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05); mat-icon { font-size: 18px; width: 18px; height: 18px; } }
    .icon.bg-primary { color: #00288e; }
    .icon.bg-secondary { color: #006a61; }
    .text { display: flex; flex-direction: column; }
    .text .lbl { font-size: 11px; color: #444653; }
    .val-group { display: flex; align-items: center; gap: 8px; }
    .text .val { font-size: 16px; font-weight: 600; color: #0b1c30; }
    .tag { font-size: 11px; font-weight: 600; background: rgba(137,245,231,0.5); color: #006a61; padding: 2px 6px; border-radius: 4px; }
  `]
})
export class ProfileOverviewCardComponent {
  @Input({ required: true }) member!: Member;

  get daysRemaining(): number {
    const diff = new Date(this.member.cardExpiry).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }
}