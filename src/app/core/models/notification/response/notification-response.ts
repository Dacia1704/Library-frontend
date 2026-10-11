export interface NotificationResponse {
  id: number;
  memberId: number;
  content: string;
  read: boolean;
  createdAt: string; // ISO datetime string
}
