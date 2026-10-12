import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Subscription } from 'rxjs';
import { NotificationService } from '@services/notification.service';
import { Notification } from '@model/notification/notification.model';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="notificationMenu" [matBadge]="unreadCount" [matBadgeHidden]="unreadCount === 0" matBadgeColor="warn" matBadgeSize="small">
      <mat-icon>notifications</mat-icon>
    </button>
    
    <mat-menu #notificationMenu="matMenu" class="notification-menu">
      <div class="notification-header" (click)="$event.stopPropagation()">
        <h3>Thông báo</h3>
        @if (notifications.length > 0) {
          <button mat-button color="primary" (click)="clearAll()">Xóa tất cả</button>
        }
      </div>
      
      <mat-divider></mat-divider>
      
      @if (notifications.length === 0) {
        <div class="notification-empty" (click)="$event.stopPropagation()">
          <mat-icon>notifications_none</mat-icon>
          <p>Không có thông báo nào</p>
        </div>
      } @else {
        <div class="notification-list" (click)="$event.stopPropagation()">
          @for (notification of notifications; track notification.id) {
            <div class="notification-item" [class.unread]="!notification.read" (click)="onNotificationClick(notification)">
              <div class="notification-content">
                <p>{{ notification.content }}</p>
                <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
              </div>
              @if (!notification.read) {
                <span class="unread-dot"></span>
              }
            </div>
          }
        </div>
      }
    </mat-menu>
  `,
  styles: [`
    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      
      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }
    }

    .notification-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
      color: rgba(0, 0, 0, 0.54);
      
      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 8px;
      }
      
      p {
        margin: 0;
        font-size: 14px;
      }
    }

    .notification-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .notification-item {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 12px 16px;
      cursor: pointer;
      transition: background-color 0.2s;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }
      
      &.unread {
        background-color: rgba(25, 118, 210, 0.08);
      }
      
      .notification-content {
        flex: 1;
        
        p {
          margin: 0 0 4px 0;
          font-size: 14px;
          line-height: 1.4;
        }
        
        .notification-time {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.54);
        }
      }
      
      .unread-dot {
        width: 8px;
        height: 8px;
        background-color: #1976d2;
        border-radius: 50%;
        margin-left: 8px;
        flex-shrink: 0;
        margin-top: 6px;
      }
    }

    ::ng-deep .notification-menu {
      max-width: 400px !important;
    }
  `]
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  private readonly notificationService = inject(NotificationService);
  private subscription?: Subscription;
  
  notifications: Notification[] = [];
  unreadCount = 0;

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$.subscribe(
      notifications => {
        this.notifications = notifications;
        this.unreadCount = this.notificationService.getUnreadCount();
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  formatTime(date: Date): string {
    try {
      return formatDistanceToNow(date, { addSuffix: true, locale: vi });
    } catch {
      return '';
    }
  }

  onNotificationClick(notification: Notification): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id);
    }
  }

  clearAll(): void {
    this.notificationService.clearNotifications();
  }
}
