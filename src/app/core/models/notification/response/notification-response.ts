export interface NotificationResponse {
  id: number;
  userId: number;
  content: string;
  read: boolean;
  createdAt: string; // ISO datetime string
}
