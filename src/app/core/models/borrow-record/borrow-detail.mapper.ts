import { BookMapper } from "@model/book/book.mapper";
import { BorrowDetail } from "./borrow-detail";
import { BorrowDetailResponse } from "./response/borrow-detail-response";
import { BorrowRecordMapper } from "./borrow-record.mapper";

export class BorrowDetailMapper {
  /**
   * Map BorrowDetailResponse (from API) → BorrowDetail (domain model)
   */
  static fromResponse(res: BorrowDetailResponse): BorrowDetail {
    return new BorrowDetail({
      id: res.id,
      book: BookMapper.toModel(res.book),
      returnDate: res.returnDate ? new Date(res.returnDate) : undefined,
      fineAmount: res.fineAmount ?? 0,
      borrowStatus: res.borrowStatus,
      borrowRecord: BorrowRecordMapper.fromResponse(res.borrowRecord),
    });
  }

  /**
   * Map an array of BorrowDetailResponse → BorrowDetail[]
   */
  static fromResponseList(resList: BorrowDetailResponse[]): BorrowDetail[] {
    return resList.map((res) => BorrowDetailMapper.fromResponse(res));
  }
}