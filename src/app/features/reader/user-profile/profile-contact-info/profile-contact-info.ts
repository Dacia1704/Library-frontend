import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Member } from '@model/member/member.model';

@Component({
  selector: 'app-profile-contact-info',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="card card-base">
      <div class="card-header">
        <div class="title-group">
          <div class="icon bg-secondary-light"><mat-icon>contact_mail</mat-icon></div>
          <div>
            <h3>Thông tin liên hệ & tài khoản</h3>
            <span class="sub">Kênh nhận thông báo mượn trả & bảo mật</span>
          </div>
        </div>
        <mat-icon class="lock">lock</mat-icon>
      </div>

      <div class="fields-grid">
        <div class="split-row">
          <div class="field">
            <label>Địa chỉ Email</label>
            <div class="val-row">
              <span class="truncate">{{ member.user?.email }}</span> 
              <mat-icon class="verified">mark_email_read</mat-icon>
            </div>
          </div>
          <div class="field">
            <label>Số điện thoại</label>
            <div class="val-row"><span class="mono">{{ member.phone }}</span> <mat-icon>call</mat-icon></div>
          </div>
        </div>

        <div class="field">
          <label>Địa chỉ liên hệ / Thường trú</label>
          <div class="val-row align-start">
            <span class="wrap-text">{{ member.address }}</span> 
            <mat-icon>location_on</mat-icon>
          </div>
        </div>

        <div class="split-row">
          <div class="field">
            <label>Ngày tạo tài khoản</label>
            <div class="val-row"><span>{{ member.user?.createdAt | date:'dd/MM/yyyy HH:mm' }}</span></div>
          </div>
        </div>

        <div class="field">
          <label>Vai trò & Quyền hạn hệ thống</label>
          <div class="role-row">
            <strong>{{ member.user.roleName }}</strong> <span class="dot">•</span> <span>{{member.user.roleName == "READER" ? "Tra cứu tài liệu, Đọc tại chỗ. Nếu bạn muốn mượn sách hãy đăng kí thành viên nhé!": "Tra cứu tài liệu, đăng kí mượn, đọc tại chỗ"}}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-base { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); height: 100%; box-sizing: border-box; }
    .card-header { display: flex; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; }
    .title-group { display: flex; gap: 12px; align-items: center; h3 { margin: 0; font-size: 16px; font-weight: 700; color: #0b1c30; } .sub { font-size: 12px; color: #444653; } }
    .icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; mat-icon { font-size: 18px; width: 18px; height: 18px; } }
    .bg-secondary-light { background: #89f5e7; color: #005049; }
    .lock { color: #757684; font-size: 18px; width: 18px; height: 18px; }
    
    .fields-grid { display: flex; flex-direction: column; gap: 16px; }
    .field { background: rgba(239,244,255,0.5); padding: 12px; border-radius: 8px; display: flex; flex-direction: column; gap: 4px; }
    .field label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #444653; }
    .val-row { display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: #0b1c30; mat-icon { font-size: 16px; width: 16px; height: 16px; color: #757684; } }
    .val-row.align-start { align-items: flex-start; mat-icon { margin-top: 2px; } }
    .val-col { display: flex; flex-direction: column; font-size: 14px; color: #0b1c30; } .sub-ip { font-size: 11px; font-family: monospace; color: #757684; }
    .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px; }
    .wrap-text { line-height: 1.4; }
    .mono { font-family: monospace; }
    .verified { color: #006a61 !important; }
    .split-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .role-row { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; font-size: 13px; color: #444653; strong { color: #0b1c30; font-size: 14px; } .dot { color: #c4c5d5; } }
  `]
})
export class ProfileContactInfoComponent {
  @Input({ required: true }) member!: Member;
}