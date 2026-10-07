export interface MemberCreateRequest {
  userId: number;
  identityNumber: string;   // max 12
  phone?: string;       // max 15
  address?: string;     // max 255
  amount?: number;      // BigDecimal -> number
}