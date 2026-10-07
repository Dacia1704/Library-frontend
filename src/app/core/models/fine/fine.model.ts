import { BorrowDetail } from "@model/borrow-record/borrow-detail";

// Fine model for frontend
export interface Fine {
  id: number;
  borrowId: number;
  borrowDetailId?: number;
  borrowDetail?: BorrowDetail;
  amount: number;
  reason: FineReason;
  overdueDays?: number;
  note?: string;
  createdAt: string;
  isDeleted: boolean;
  // Computed/display fields
  borrowCode?: string;
  bookTitle?: string;
  barcode?: string;
  isPaid?: boolean;
}

export type FineReason = 
  | 'OVERDUE'           // Nộp muộn
  | 'LOST'              // Làm mất
  | 'DAMAGED_LIGHT'     // Hư hỏng nhẹ
  | 'DAMAGED_HEAVY_REPAIRABLE'  // Hỏng nặng (sửa được)
  | 'DAMAGED_HEAVY_IRREPARABLE'; // Hỏng (không dùng được)

export const FINE_REASON_LABELS: Record<FineReason, string> = {
  OVERDUE: 'Nộp muộn',
  LOST: 'Làm mất',
  DAMAGED_LIGHT: 'Hư hỏng nhẹ',
  DAMAGED_HEAVY_REPAIRABLE: 'Hỏng nặng (sửa được)',
  DAMAGED_HEAVY_IRREPARABLE: 'Hỏng (không dùng được)',
};

export const FINE_REASON_COLORS: Record<FineReason, { bg: string; text: string }> = {
  OVERDUE: { bg: 'bg-amber-50', text: 'text-amber-800' },
  LOST: { bg: 'bg-red-100', text: 'text-red-900' },
  DAMAGED_LIGHT: { bg: 'bg-blue-50', text: 'text-blue-700' },
  DAMAGED_HEAVY_REPAIRABLE: { bg: 'bg-orange-50', text: 'text-orange-700' },
  DAMAGED_HEAVY_IRREPARABLE: { bg: 'bg-rose-50', text: 'text-rose-700' },
};
