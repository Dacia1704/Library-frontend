import { BorrowStatus } from "@model/enum/borrow-status.enum";
import { Member } from "@model/member/member.model";
import { User } from "@model/user/user.model";

export interface BorrowDetail {
  id: number;
  bookId: number;
  bookTitle: string;
  bookCode: string;
  returnDate?: Date;
  fineAmount: number;
  borrowStatus: BorrowStatus;
}

export class BorrowRecord {
  id: number;
  member: Member;
  librarian: User;
  borrowDate: Date;
  dueDate: Date;
  note: string;
  borrowDetails: BorrowDetail[];

  constructor(data: Partial<BorrowRecord> = {}) {
    this.id = data.id ?? 0;
    this.member = data.member!;
    this.librarian = data.librarian!;
    this.borrowDate = data.borrowDate ?? new Date();
    this.dueDate = data.dueDate ?? new Date();
    this.note = data.note ?? '';
    this.borrowDetails = data.borrowDetails ?? [];
  }

  /** Computed: number of borrowed books */
  get bookCount(): number {
    return this.borrowDetails.length;
  }

  /** Computed: overall record status derived from borrow details */
  get status(): 'borrowing' | 'returned' | 'overdue' {
    const hasOverdue = this.borrowDetails.some(d => d.borrowStatus === BorrowStatus.OVERDUE);
    if (hasOverdue) return 'overdue';

    const allReturned = this.borrowDetails.every(d => d.borrowStatus === BorrowStatus.RETURNED);
    if (allReturned) return 'returned';

    return 'borrowing';
  }

  /** Computed: max overdue days across all details */
  get overdueDays(): number {
    const today = new Date();
    const overdueDetails = this.borrowDetails.filter(
      d => d.borrowStatus !== BorrowStatus.RETURNED && d.returnDate && new Date(d.returnDate) > this.dueDate
    );
    if (overdueDetails.length === 0) {
      // Not returned yet and past due
      if (this.status === 'overdue') {
        const diff = today.getTime() - this.dueDate.getTime();
        return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
      }
      return 0;
    }
    // Already returned but late
    return Math.max(...overdueDetails.map(d => {
      const diff = new Date(d.returnDate!).getTime() - this.dueDate.getTime();
      return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }));
  }

  /** Computed: days remaining until due date */
  get daysLeft(): number {
    if (this.status !== 'borrowing') return 0;
    const today = new Date();
    const diff = this.dueDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }
}
