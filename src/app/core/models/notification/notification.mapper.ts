import { Notification } from './notification.model';
import { NotificationResponse } from './response/notification-response';

export class NotificationMapper {
  /**
   * Map NotificationResponse (from API) → Notification (domain model)
   */
  static fromResponse(res: NotificationResponse): Notification {
    return new Notification({
      id: res.id,
      userId: res.userId,
      content: res.content,
      read: res.read,
      createdAt: new Date(res.createdAt)
    });
  }

  /**
   * Map an array of NotificationResponse → Notification[]
   */
  static fromResponseList(resList: NotificationResponse[]): Notification[] {
    return resList.map((res) => NotificationMapper.fromResponse(res));
  }
}
