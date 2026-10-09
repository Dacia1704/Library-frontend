import { MemberMapper } from "@model/member/member.mapper";
import { UserMapper } from "@model/user/user.mapper";
import { BookMapper } from "@model/book/book.mapper";
import { BorrowRecord } from "./borrow-record";
import { BorrowRecordResponse } from "./response/borrow-record-response";

export class BorrowRecordMapper {
  /**
   * Map BorrowRecordResponse (from API) → BorrowRecord (domain model)
   */
  static fromResponse(res: BorrowRecordResponse): BorrowRecord {
    return new BorrowRecord({
      id: res.id,
      member: MemberMapper.fromResponse(res.member),
      librarian: UserMapper.fromResponse(res.librarian),
      borrowDate: new Date(res.borrowDate),
      dueDate: new Date(res.dueDate),
      note: res.note,
      borrowDetails: res.borrowDetails.map(d => ({
        id: d.id,
        book: BookMapper.toModel(d.book),
        returnDate: d.returnDate ? new Date(d.returnDate) : undefined,
        fineAmount: d.fineAmount ?? 0,
        borrowStatus: d.borrowStatus,
      })),
    });
  }

  /**
   * Map an array of BorrowRecordResponse → BorrowRecord[]
   */
  static fromResponseList(resList: BorrowRecordResponse[]): BorrowRecord[] {
    return resList.map((res) => BorrowRecordMapper.fromResponse(res));
  }
}
