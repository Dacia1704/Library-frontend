import { MemberResponse } from "@model/member/response/member-response";
import { UserResponse } from "@model/user/response/user-response";

export interface BorrowRecordResponse {
  id: number;

  member: MemberResponse;
  librarian: UserResponse;

  borrowDate: string; // ISO date string (LocalDate)
  dueDate: string;    // ISO date string (LocalDate)

  note?: string;
}