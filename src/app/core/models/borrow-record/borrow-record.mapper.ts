import { MemberMapper } from "@model/member/member.mapper";
import { UserMapper } from "@model/user/user.mapper";
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
    });
  }

  /**
   * Map an array of BorrowRecordResponse → BorrowRecord[]
   */
  static fromResponseList(resList: BorrowRecordResponse[]): BorrowRecord[] {
    return resList.map((res) => BorrowRecordMapper.fromResponse(res));
  }
}