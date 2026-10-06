import { User } from './user.model';
import { UserResponse } from './response/user-response';
import { UserRequest } from './request/user-request';
import { UserFilter } from './request/user-filter';
import { MemberMapper } from '../member/member.mapper';

export class UserMapper {
  /**
   * Map UserResponse (from API) → User (domain model)
   */
  static fromResponse(res: UserResponse): User {
    return new User({
      id: res.id,
      username: res.username,
      fullName: res.fullName,
      email: res.email,
      avatar: res.avatar,
      roleId: res.roleId,
      roleName: res.roleName,
      isActive: res.isActive,
      createdAt: new Date(res.createdAt),
    });
  }

  /**
   * Map User (domain model) → UserRequest (for create/update)
   */
  static toRequest(user: User, password = ''): UserRequest {
    return {
      username: user.username,
      password,
      fullName: user.fullName,
      email: user.email,
      identityNumber: '',   // filled separately — not stored on User domain model
      avatar: user.avatar,
      roleId: user.roleId,
      isActive: user.isActive,
    };
  }

  /**
   * Build a UserFilter payload
   */
  static toFilter(partial: Partial<UserFilter> = {}): UserFilter {
    return {
      keyword: partial.keyword,
      email: partial.email,
      roleId: partial.roleId,
      isMember: partial.isMember,
      phone: partial.phone,
    };
  }

  /**
   * Map an array of UserResponse → User[]
   */
  static fromResponseList(resList: UserResponse[]): User[] {
    return resList.map((res) => UserMapper.fromResponse(res));
  }
}
