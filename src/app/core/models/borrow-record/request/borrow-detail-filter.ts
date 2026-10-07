import { BorrowStatus } from "@model/enum/borrow-status.enum";

export interface BorrowDetailFilter {
  status?: BorrowStatus;
  keyword?: string;
  year?: number;
}