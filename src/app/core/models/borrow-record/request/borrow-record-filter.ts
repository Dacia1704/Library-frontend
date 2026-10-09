import { BorrowStatus } from "@model/enum/borrow-status.enum";

export interface BorrowRecordFilter {
  /** Search by member name, code, identity number */
  memberKeyword?: string;
  /** Search by book title or code */
  bookKeyword?: string;
  /** Filter by borrow date range start */
  startBorrowDate?: string;
  /** Filter by borrow date range end */
  endBorrowDate?: string;
  /** Filter by status */
  status?: BorrowStatus;
}
