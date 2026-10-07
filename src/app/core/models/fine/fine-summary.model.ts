// Fine statistics summary
export interface FineSummary {
  totalFines: number;      // Tổng tiền phạt
  totalFinesCount: number;  // Số khoản phạt
  paidAmount: number;      // Đã thanh toán
  paidCount: number;       // Số biên lai đã thanh toán
  unpaidAmount: number;    // Còn phải nộp
  unpaidCount: number;     // Số khoản chưa thanh toán
  overdueFinesCount: number; // Số phiếu quá hạn
  overdueBooksCount: number; // Số cuốn quá hạn
}
