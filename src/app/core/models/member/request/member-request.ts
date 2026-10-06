export interface MemberRequest {
  userId: number;
  memberCode: string;   // max 20
  phone?: string;       // max 15
  address?: string;     // max 255
  cardExpiry: string;   // ISO date string (LocalDate)
}