import { CardStatus } from '@model/enum/card-status.enum';
import { User } from '../user/user.model';

export class Member {
  id: number;
  user: User;
  memberCode: string;
  phone: string;
  address: string;
  identityNumber: string;
  cardExpiry: Date;
  cardStatus: CardStatus

  constructor(data: Partial<Member> = {}) {
    this.id = data.id ?? 0;
    this.user = data.user!;
    this.memberCode = data.memberCode ?? '';
    this.phone = data.phone ?? '';
    this.address = data.address ?? '';
    this.identityNumber = data.identityNumber ?? '';
    this.cardExpiry = data.cardExpiry ?? new Date();
    this.cardStatus = data.cardStatus ?? CardStatus.PENDING;
  }

  get isExpired(): boolean {
    return this.cardExpiry < new Date();
  }
}