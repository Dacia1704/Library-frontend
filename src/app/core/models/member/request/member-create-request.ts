export interface MemberCreateRequest {
  userId: number;
  phone?: string;       // max 15
  address?: string;     // max 255
  amount?: number;      // BigDecimal -> number
}