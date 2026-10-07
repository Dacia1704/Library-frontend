// Fine payment model for frontend
export interface FinePayment {
  id: number;
  memberId: number;
  amount: number;
  paidAt: string;
  receivedBy: number;
  receivedByUsername?: string;
  note?: string;
  isDeleted: boolean;
}
