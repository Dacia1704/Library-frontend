import { CardStatus } from "@model/enum/card-status.enum";

export interface MemberRequest {
  userId: number;
  identityNumber: string;   // max 12
  memberCode: string;   // max 20
  phone?: string;       // max 15
  address?: string;     // max 255
  cardExpiry: string;   // ISO date string (LocalDate)
  cardStatus: CardStatus;
}