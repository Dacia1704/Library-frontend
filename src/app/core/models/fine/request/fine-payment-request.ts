// FinePaymentRequest - Request body cho API POST /fine-payments
export interface FinePaymentRequest {
  amount: number;
  note?: string;
}
