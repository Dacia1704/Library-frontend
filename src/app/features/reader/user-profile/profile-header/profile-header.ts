import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="header-container">
      <div class="breadcrumb-group">
        <nav class="breadcrumb">
          <button
          type="button"
          class="breadcrumb-link home-link"
          (click)="goToBooks()"
          aria-label="Trang tra cứu sách">
            <mat-icon>home</mat-icon>
            Trang chủ
          </button>
        <span class="sep">chevron_right</span>
        <strong>Thông tin cá nhân</strong>
        </nav>
        <div class="title-row">
          <h1>Thông tin cá nhân</h1>
          <mat-icon class="verified">verified_user</mat-icon>
        </div>
        <p class="subtitle">Quản lý và theo dõi thông tin tài khoản bạn đọc tại thư viện</p>
      </div>
      <div class="actions">
        <div class="read-only-pill"><mat-icon>lock</mat-icon> Hồ sơ chỉ xem (Read-only)</div>
        <button mat-stroked-button (click)="goBack()"><mat-icon>arrow_back</mat-icon> Quay lại</button>
      </div>
    </div>
  `,
  styles: [`
    .header-container { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 16px; margin-bottom: 8px; }
    .breadcrumb-group { display: flex; flex-direction: column; gap: 4px; }
    .breadcrumb { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #444653; mat-icon { font-size: 16px; width: 16px; height: 16px; } strong { color: #00288e; } }
    .sep { font-family: 'Material Symbols Outlined'; font-size: 14px; color: #757684; }
    .title-row { display: flex; align-items: center; gap: 8px; h1 { margin: 0; font-size: 24px; font-weight: 700; color: #0b1c30; } .verified { color: #757684; } }
    .subtitle { margin: 0; font-size: 14px; color: #444653; }
    .actions { display: flex; align-items: center; gap: 12px; }
    .read-only-pill { display: flex; align-items: center; gap: 6px; background: #e5eeff; padding: 6px 12px; border-radius: 8px; font-size: 12px; color: #444653; mat-icon { font-size: 16px; width: 16px; height: 16px; color: #757684; } }
    .breadcrumb-link {border: none;background: none;padding: 0;font: inherit;color: #444653;cursor: pointer; display: flex; align-items: center; justify-content: flex-end; gap: 4px}
  `]
})
export class ProfileHeaderComponent {
  goBack() { history.back(); }

  private readonly router = inject(Router);

  goToBooks(): void {
    this.router.navigate(['/reader/books']);
  }
}