import { Member } from './member.model';
import { MemberResponse } from './response/member-response';
import { MemberRequest } from './request/member-request';
import { MemberCreateRequest } from './request/member-create-request';
import { MemberRenewRequest } from './request/member-renew-request';
import { UserMapper } from '@model/user/user.mapper';

export class MemberMapper {
  /**
   * Map MemberResponse (from API) → Member (domain model)
   */
  static fromResponse(res: MemberResponse): Member {
    return new Member({
      id: res.id,
      user: UserMapper.fromResponse(res.user),
      memberCode: res.memberCode,
      phone: res.phone,
      address: res.address,
      identityNumber: res.identityNumber,
      cardExpiry: new Date(res.cardExpiry),
      cardStatus: res.cardStatus
    });
  }

  /**
   * Map Member (domain model) → MemberRequest (for create/update)
   */
  static toRequest(member: Member): MemberRequest {
    return {
      userId: member.user.id,
      memberCode: member.memberCode,
      identityNumber: member.identityNumber,
      phone: member.phone,
      address: member.address,
      cardExpiry: member.cardExpiry.toISOString().split('T')[0], // yyyy-MM-dd
      cardStatus: member.cardStatus
    };
  }

  /**
   * Build a MemberCreateRequest payload
   */
  static toCreateRequest(
    userId: number,
    identityNumber: string,
    phone?: string,
    address?: string,
    amount?: number
  ): MemberCreateRequest {
    return { userId, identityNumber, phone, address, amount };
  }

  /**
   * Build a MemberRenewRequest payload
   */
  static toRenewRequest(amount?: number): MemberRenewRequest {
    return { amount };
  }

  /**
   * Map an array of MemberResponse → Member[]
   */
  static fromResponseList(resList: MemberResponse[]): Member[] {
    return resList.map((res) => MemberMapper.fromResponse(res));
  }
}
