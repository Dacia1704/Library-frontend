import { FineReason } from '@model/enum/fine-reason.enum';
import { FineResponse } from './response/fine-response';
import { Fine } from './fine.model';
import { BorrowDetailMapper } from '@model/borrow-record/borrow-detail.mapper';

export class FineMapper {
  /**
   * Map FineResponse (from API) → Fine (domain model)
   */
  static fromResponse(res: FineResponse): Fine {
    return {
      id: res.id,
      borrowId: res.borrowId,
      borrowDetailId: res.borrowDetailId,
      borrowDetail: res.borrowDetail ? BorrowDetailMapper.fromResponse(res.borrowDetail) : undefined,
      amount: typeof res.amount === 'string' ? parseFloat(res.amount) : res.amount,
      reason: res.reason as FineReason,
      overdueDays: res.overdueDays,
      note: res.note,
      createdAt: res.createdAt,
      isDeleted: res.isDeleted,
      // Computed fields - will be mapped from additional API data or left as undefined
      isPaid: false, // TODO: This needs to come from a join with fine_payments
    };
  }

  /**
   * Map an array of FineResponse → Fine[]
   */
  static fromResponseList(resList: FineResponse[]): Fine[] {
    return resList.map((res) => FineMapper.fromResponse(res));
  }
}
