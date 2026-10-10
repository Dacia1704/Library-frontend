import { CardStatus } from '@model/enum/card-status.enum';

export interface MemberUpdateRequest {
  // Member fields (excluding userId, memberCode, cardExpiry as they should not be updated)
  identityNumber?: string;   // max 12
  phone?: string;           // max 15
  cardStatus?: CardStatus;
  address?: string;         // max 255

  // User fields linked to this member
  username?: string;        // max 50
  password?: string;        // min 6, max 100
  fullName?: string;        // max 100
  email?: string;           // max 100, email format
  avatar?: string;
  roleId?: number;
  isActive?: boolean;
}
