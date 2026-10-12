export class Notification {
  id: number;
  memberId: number;
  content: string;
  read: boolean;
  createdAt: Date;

  constructor(data: {
    id: number;
    memberId: number;
    content: string;
    read: boolean;
    createdAt: Date;
  }) {
    this.id = data.id;
    this.memberId = data.memberId;
    this.content = data.content;
    this.read = data.read;
    this.createdAt = data.createdAt;
  }
}
