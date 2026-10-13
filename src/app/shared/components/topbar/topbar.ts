import { Component, inject, output, signal, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { LoginResponse } from '@model/auth/response/login-response';
import { ImageUtils } from '@shared/utils/image-utils';
import { NotificationService } from '@services/notification.service';
import { Notification } from '@model/notification/notification.model';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-topbar',
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule,
    MatIconModule,
    DatePipe,
    CommonModule
  ],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar implements OnInit {

  goToProfile = output<void>();
  goToMemberCard = output<void>();
  logoutClick = output<void>();

  private readonly authKey = 'library_auth';
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly defaultAvatar =
    'https://ui-avatars.com/api/?name=U&background=1e40af&color=fff&size=64';

  notifications: Notification[] = [];
  unreadCount = signal(0);
  showNotifications = signal(false);

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

  get userBaseRole(): string {
    const authorities = this.getAuth()?.authorities ?? [];
    if (authorities.includes('ROLE_ADMIN')) return "ADMIN";
    if (authorities.includes('ROLE_LIBRARIAN')) return "LIBRARIAN";
    if (authorities.includes('ROLE_MEMBER')) return "MEMBER";
    return "READER";
  }

  get userRole(): string {
    const authorities = this.getAuth()?.authorities ?? [];

    if (authorities.includes('ROLE_ADMIN')) {
      return 'Quản trị viên';
    }

    if (authorities.includes('ROLE_LIBRARIAN')) {
      return 'Thủ thư';
    }

    if (authorities.includes('ROLE_READER')) {
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

  // ===== Notification Methods =====

  ngOnInit(): void {
    this.notificationService.notifications$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(notifications => {
        this.notifications = notifications;
        this.updateUnreadCount();
      });

    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getMyNotifications().subscribe({
      next: () => {
        // Notifications will be updated via the observable
      },
      error: (err) => {
        console.error('Error loading notifications:', err);
      }
    });
  }

  markAsRead(id: number): void {
    this.notificationService.markAsRead(id).subscribe({
      error: (err) => {
        console.error('Error marking notification as read:', err);
      }
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      error: (err) => {
        console.error('Error marking all notifications as read:', err);
      }
    });
  }

  deleteNotification(id: number): void {
    this.notificationService.deleteNotification(id).subscribe({
      error: (err) => {
        console.error('Error deleting notification:', err);
      }
    });
  }

  toggleNotifications(): void {
    this.showNotifications.set(!this.showNotifications());
  }

  private updateUnreadCount(): void {
    this.unreadCount.set(this.notifications.filter(n => !n.read).length);
  }
}