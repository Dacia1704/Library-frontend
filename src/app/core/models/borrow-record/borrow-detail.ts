import { Book } from "@model/book/book.model";
import { BorrowStatus } from "@model/enum/borrow-status.enum";
import { BorrowRecord } from "./borrow-record";

export class BorrowDetail {
  id: number;
  book: Book;
  returnDate?: Date;
  fineAmount: number;
  borrowStatus: BorrowStatus;
  borrowRecord: BorrowRecord;

  constructor(data: Partial<BorrowDetail> = {}) {
    this.id = data.id ?? 0;
    this.book = data.book!;
    this.returnDate = data.returnDate;
    this.fineAmount = data.fineAmount ?? 0;
    this.borrowStatus = data.borrowStatus ?? BorrowStatus.BORROWING;
    this.borrowRecord = data.borrowRecord!;
  }

  get isReturned(): boolean {
    return this.borrowStatus === BorrowStatus.RETURNED;
  }

  get hasFine(): boolean {
    return (this.fineAmount ?? 0) > 0;
  }
}