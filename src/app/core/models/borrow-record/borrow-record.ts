import { Member } from "@model/member/member.model";
import { User } from "@model/user/user.model";

export class BorrowRecord {
  id: number;
  member: Member;
  librarian: User;
  borrowDate: Date;
  dueDate: Date;
  note: string;

  constructor(data: Partial<BorrowRecord> = {}) {
    this.id = data.id ?? 0;
    this.member = data.member!;
    this.librarian = data.librarian!;
    this.borrowDate = data.borrowDate ?? new Date();
    this.dueDate = data.dueDate ?? new Date();
    this.note = data.note ?? '';
  }
}