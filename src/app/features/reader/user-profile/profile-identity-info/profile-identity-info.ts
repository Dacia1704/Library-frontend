import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Member } from '@model/member/member.model';

@Component({
  selector: 'app-profile-identity-info',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="card card-base">
      <div class="card-header">
        <div class="title-group">
          <div class="icon bg-primary-light"><mat-icon>person</mat-icon></div>
          <div>
            <h3>Thông tin định danh & cá nhân</h3>
            <span class="sub">Dữ liệu đối chiếu CSDL Dân cư quốc gia</span>
          </div>
        </div>
        <mat-icon class="lock">lock</mat-icon>
      </div>

      <div class="fields-grid">
        <div class="field">
          <label>Họ và tên bạn đọc</label>
          <div class="val-row"><strong>{{ member.user?.fullName }}</strong> <mat-icon>lock</mat-icon></div>
        </div>
        
        <div class="field">
          <label>Tên đăng nhập hệ thống (Username)</label>
          <div class="val-row"><span class="mono">{{ member.user?.username }}</span> <span class="tag">Tài khoản nội bộ</span></div>
        </div>

        <div class="field">
          <label>Số CCCD / Định danh cá nhân</label>
          <div class="val-row"><span class="mono strong">{{ member.identityNumber }}</span> <span class="tag success"><mat-icon>verified</mat-icon> Đã xác thực</span></div>
        </div>

        <div class="split-row">
          <div class="field">
            <label>Ngày sinh</label>
            <div class="val-row"><span>14/08/1998</span> <mat-icon>cake</mat-icon></div>
          </div>
          <div class="field">
            <label>Giới tính</label>
            <div class="val-row"><span>Nam</span> <mat-icon>male</mat-icon></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-base { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
    .card-header { display: flex; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid transparent; }
    .title-group { display: flex; gap: 12px; align-items: center; h3 { margin: 0; font-size: 16px; font-weight: 700; color: #0b1c30; } .sub { font-size: 12px; color: #444653; } }
    .icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; mat-icon { font-size: 18px; width: 18px; height: 18px; } }
    .bg-primary-light { background: #dde1ff; color: #00288e; }
    .lock { color: #757684; font-size: 18px; width: 18px; height: 18px; }
    
    .fields-grid { display: flex; flex-direction: column; gap: 16px; }
    .field { background: rgba(239,244,255,0.5); padding: 12px; border-radius: 8px; display: flex; flex-direction: column; gap: 4px; }
    .field label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #444653; }
    .val-row { display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: #0b1c30; mat-icon { font-size: 16px; width: 16px; height: 16px; color: #757684; } }
    .mono { font-family: monospace; } .mono.strong { font-weight: 700; letter-spacing: 1px; }
    .tag { font-size: 11px; background: #e5eeff; padding: 2px 8px; border-radius: 4px; color: #757684; display: flex; align-items: center; gap: 4px; }
    .tag.success { background: rgba(137,245,231,0.5); color: #006a61; font-weight: 600; mat-icon { font-size: 14px; width: 14px; height: 14px; } }
    .split-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  `]
})
export class ProfileIdentityInfoComponent {
  @Input({ required: true }) member!: Member;
}