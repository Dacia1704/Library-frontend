import { BorrowDetailResponse } from "@model/borrow-record/response/borrow-detail-response";

// FineResponse - Response từ API GET /fines
export interface FineResponse {
  id: number;
  borrowId: number;
  borrowDetailId?: number;
  borrowDetail?: BorrowDetailResponse;
  amount: string | number;
  reason: string;
  overdueDays?: number;
  note?: string;
  createdAt: string;
  isDeleted: boolean;
}
