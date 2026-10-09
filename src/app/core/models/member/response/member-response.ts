import { CardStatus } from "@model/enum/card-status.enum";
import { UserResponse } from "@model/user/response/user-response";

export interface MemberResponse {
  id: number;
  user: UserResponse
  memberCode: string;
  phone: string;
  address: string;
  identityNumber: string;
  cardExpiry: string; // ISO date string (LocalDate)
  cardStatus: CardStatus;
  isDeleted: boolean;
  createdAt: string; // ISO date string (LocalDateTime)
}