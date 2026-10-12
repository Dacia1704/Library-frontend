// FinePaymentRequest - Request body cho API POST /fine-payments
export interface FinePaymentRequest {
  memberId: number;
  amount: number;
  note?: string;
}
