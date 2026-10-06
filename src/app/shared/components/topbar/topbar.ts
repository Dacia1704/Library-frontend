import { Component, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { LoginResponse } from '@model/auth/response/login-response';

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
  logoutClick = output<void>();

  private readonly authKey = 'library_auth';

  get userName(): string {
    return this.getAuth()?.username ?? '';
  }

  get userAvatar(): string {
    return this.getAuth()?.avatar ?? '';
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