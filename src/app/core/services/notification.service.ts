import { HttpClient } from '@angular/common/http';
import { Injectable, inject, OnDestroy, Injector } from '@angular/core';
import { Observable, tap, map, BehaviorSubject, Subject } from 'rxjs';
import { environment } from '@environments/environment';
import { ApiResponse } from '@model/api-response';
import { Notification } from '@model/notification/notification.model';
import { NotificationResponse } from '@model/notification/response/notification-response';
import { NotificationMapper } from '@model/notification/notification.mapper';
import { ToastService } from './toast.service';
import SockJS from 'sockjs-client';
import { Client, Frame } from '@stomp/stompjs';
import { AuthService } from './auth.service';

const NOTIFICATION_TOPIC = '/user/queue/notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private http = inject(HttpClient);
  private injector = inject(Injector);
  private toastService = inject(ToastService);
  
  private api = `${environment.apiUrl}/notifications`;

  // Lazy getter for AuthService to avoid circular dependency
  private get authService() {
    return this.injector.get(AuthService);
  }

  // WebSocket
  private stompClient: Client | null = null;
  private connected = false;
  private newNotificationSubject = new Subject<Notification>();
  
  // State management
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);

  // Public observables
  readonly notifications$ = this.notificationsSubject.asObservable();
  readonly newNotification$ = this.newNotificationSubject.asObservable();

  // ===== REST API Methods =====

  /**
   * Get my notifications (current logged-in user)
   * @param isRead - Optional filter: true = read only, false = unread only, undefined = all
   */
  getMyNotifications(isRead?: boolean): Observable<ApiResponse<Notification[]>> {
    const params = new URLSearchParams();
    if (isRead !== undefined) {
      params.append('isRead', isRead.toString());
    }
    
    const queryString = params.toString();
    const url = queryString ? `${this.api}/me?${queryString}` : `${this.api}/me`;

    return this.http.get<ApiResponse<NotificationResponse[]>>(url).pipe(
      map(response => ({
        ...response,
        data: NotificationMapper.fromResponseList(response.data)
      })),
      tap(response => {
        this.notificationsSubject.next(response.data);
      })
    );
  }

  /**
   * Mark a notification as read
   */
  markAsRead(id: number): Observable<ApiResponse<Notification>> {
    return this.http.put<ApiResponse<NotificationResponse>>(`${this.api}/me/${id}/read`, null).pipe(
      map(response => ({
        ...response,
        data: NotificationMapper.fromResponse(response.data)
      })),
      tap(response => {
        this.updateNotificationInList(response.data);
      })
    );
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<void> {
    return this.http.put<ApiResponse<void>>(`${this.api}/me/read-all`, {}).pipe(
      map(() => void 0),
      tap(() => {
        this.markAllAsReadInList();
      })
    );
  }

  /**
   * Delete a notification
   */
  deleteNotification(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/me/${id}`).pipe(
      map(() => void 0),
      tap(() => {
        this.removeNotificationFromList(id);
      })
    );
  }

  // ===== WebSocket Methods =====

  /**
   * Connect to WebSocket server
   */
  connect(): void {
    const token = this.authService.accessToken;
    if (!token) {
      console.warn('No access token available for WebSocket connection');
      return;
    }

    if (this.connected) {
      console.log('WebSocket already connected');
      return;
    }

    // Use SockJS to create the WebSocket connection
    // Include token in URL for the initial handshake (SockJS /info endpoint)
    const socket = new SockJS(`${environment.wsUrl}?token=${encodeURIComponent(token)}`);

    this.stompClient = new Client({
      webSocketFactory: () => socket as WebSocket,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      onConnect: (frame: Frame) => {
        console.log('WebSocket Connected successfully!', frame);
        this.connected = true;

        this.stompClient?.subscribe(NOTIFICATION_TOPIC, (message) => {
          console.log('Received notification:', message.body);
          try {
            const notification: Notification = NotificationMapper.fromResponse(
              JSON.parse(message.body)
            );
            this.handleNewNotification(notification);
          } catch (error) {
            console.error('Error parsing notification:', error);
          }
        });
        console.log('🔔 Subscribed to', NOTIFICATION_TOPIC);
      },
      onStompError: (frame) => {
        console.error('STOMP Error:', frame);
        this.toastService.error('Kết nối thông báo thất bại');
      },
      onWebSocketError: (error) => {
        console.error('WebSocket Error:', error);
      },
      onDisconnect: (frame) => {
        console.log('🔌 WebSocket Disconnected:', frame);
        this.connected = false;
      },
      // Reconnection settings
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.stompClient.activate();
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      this.connected = false;
      console.log('WebSocket disconnected');
    }
  }

  // ===== Private Helper Methods =====

  private handleNewNotification(notification: Notification): void {
    console.log('New notification received:', notification);

    // Add to notifications list at the beginning
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([notification, ...currentNotifications]);

    // Emit new notification event
    this.newNotificationSubject.next(notification);

    // Show toast notification
    this.toastService.info(notification.content);
  }

  private updateNotificationInList(notification: Notification): void {
    const currentNotifications = this.notificationsSubject.value;
    const updated = currentNotifications.map(n =>
      n.id === notification.id ? notification : n
    );
    this.notificationsSubject.next(updated);
  }

  private markAllAsReadInList(): void {
    const currentNotifications = this.notificationsSubject.value;
    const updated = currentNotifications.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(updated);
  }

  private removeNotificationFromList(id: number): void {
    const currentNotifications = this.notificationsSubject.value;
    const filtered = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(filtered);
  }

  // ===== Public Helper Methods =====

  /**
   * Clear all notifications from local state
   */
  clearNotifications(): void {
    this.notificationsSubject.next([]);
  }

  /**
   * Get unread count
   */
  getUnreadCount(): number {
    return this.notificationsSubject.value.filter(n => !n.read).length;
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
