export interface MemberPaymentResponse {
  id: number;
  memberId: number;
  memberCode: string;
  memberName: string;
  amount: number;
  paymentType: string;
  paidAt: string;
  receivedBy: number;
  receivedByUsername: string;
  note: string;
}