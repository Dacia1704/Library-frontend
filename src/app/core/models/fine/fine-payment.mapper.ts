import { FinePaymentResponse } from './response/fine-payment-response';
import { FinePayment } from './fine-payment.model';

export class FinePaymentMapper {
  /**
   * Map FinePaymentResponse (from API) → FinePayment (domain model)
   */
  static fromResponse(res: FinePaymentResponse): FinePayment {
    return {
      id: res.id,
      memberId: res.memberId,
      amount: typeof res.amount === 'string' ? parseFloat(res.amount) : res.amount,
      paidAt: res.paidAt,
      receivedBy: res.receivedBy,
      receivedByUsername: res.receivedByUsername,
      note: res.note,
      isDeleted: res.isDeleted,
    };
  }

  /**
   * Map an array of FinePaymentResponse → FinePayment[]
   */
  static fromResponseList(resList: FinePaymentResponse[]): FinePayment[] {
    return resList.map((res) => FinePaymentMapper.fromResponse(res));
  }
}
