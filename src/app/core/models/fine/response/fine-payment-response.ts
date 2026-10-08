// FinePaymentResponse - Response từ API GET /fine-payments
export interface FinePaymentResponse {
  id: number;
  memberId: number;
  amount: string | number;
  paidAt: string;
  receivedBy: number;
  receivedByUsername?: string;
  note?: string;
  isDeleted: boolean;
}
