export class Notification {
  id: number;
  userId: number;
  content: string;
  read: boolean;
  createdAt: Date;

  constructor(data: {
    id: number;
    userId: number;
    content: string;
    read: boolean;
    createdAt: Date;
  }) {
    this.id = data.id;
    this.userId = data.userId;
    this.content = data.content;
    this.read = data.read;
    this.createdAt = data.createdAt;
  }
}
