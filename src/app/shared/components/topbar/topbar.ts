import { Component, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { LoginResponse } from '@model/auth/response/login-response';
import { ImageUtils } from '@shared/utils/image-utils';

@Component({
  selector: 'app-topbar',
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {

  goToProfile = output<void>();
  goToMemberCard = output<void>();
  logoutClick = output<void>();

  private readonly authKey = 'library_auth';

  private readonly defaultAvatar =
    'https://ui-avatars.com/api/?name=U&background=1e40af&color=fff&size=64';

  get userName(): string {
    return this.getAuth()?.username ?? '';
  }

  /**
   * Avatar dùng cho thẻ <img>.
   * - Nếu user đã có avatar (URL / base64) → chuẩn hoá qua ImageUtils.
   * - Nếu rỗng → fallback sang ui-avatars theo tên hiển thị.
   */
  get userAvatar(): string {
    const avatar = this.getAuth()?.avatar;
    if (!avatar) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.userName || 'U')}&background=1e40af&color=fff&size=64`;
    }

    // Nếu avatar là URL (http/https) → dùng luôn để tránh re-encode.
    // Nếu là base64 thuần → ImageUtils sẽ tự ghép data URI.
    return ImageUtils.toImageSrc(avatar, this.defaultAvatar);
  }

  get userRole(): string {
    const authorities = this.getAuth()?.authorities ?? [];

    if (authorities.includes('ROLE_ADMIN')) {
      return 'Quản trị viên';
    }

    if (authorities.includes('ROLE_LIBRARIAN')) {
      return 'Thủ thư';
    }

    if (authorities.includes('ROLE_MEMBER')) {
      return 'Độc giả';
    }

    return '';
  }

  private getAuth(): LoginResponse | null {
    const value = localStorage.getItem(this.authKey);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as LoginResponse;
    } catch {
      return null;
    }
  }
}