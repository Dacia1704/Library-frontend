import { BookResponse } from "@model/book/response/book-response";
import { BorrowStatus } from "@model/enum/borrow-status.enum";
import { BorrowRecordResponse } from "./borrow-record-response";

export interface BorrowDetailResponse {
  id: number;
  book: BookResponse;
  returnDate?: string;   // ISO date string (LocalDate)
  fineAmount?: number;   // BigDecimal -> number
  borrowStatus: BorrowStatus;
  borrowRecord: BorrowRecordResponse;
}