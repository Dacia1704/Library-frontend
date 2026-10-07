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
  // Computed/display fields
  receiptCode?: string;  // e.g., BLP-2024-089
  paymentMethod?: 'CASH' | 'TRANSFER';
}
