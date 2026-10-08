import { BookResponse } from "@model/book/response/book-response";
import { BorrowStatus } from "@model/enum/borrow-status.enum";

export interface BorrowDetailResponseForRecord {
  id: number;
  book: BookResponse;
  returnDate?: string;   // ISO date string (LocalDate)
  fineAmount?: number;   // BigDecimal -> number
  borrowStatus: BorrowStatus;
}
