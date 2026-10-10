import { Role } from './role.model';
import { Permission } from './permission.model';
import { RoleResponse } from './response/role-response';
import { PermissionResponse } from './response/permission-response';
import { RoleRequest } from './request/role-request';
import { PermissionRequest } from './request/permission-request';

export class RoleMapper {
  /**
   * Map RoleResponse (from API) → Role (domain model)
   */
  static fromResponse(res: RoleResponse): Role {
    return new Role({
      id: res.id,
      name: res.name,
      description: res.description,
      permissionIds: res.permissionIds ?? [],
    });
  }

  /**
   * Map Role (domain model) → RoleRequest (for create/update)
   */
  static toRequest(role: Role): RoleRequest {
    return {
      name: role.name,
      description: role.description,
      permissionIds: role.permissionIds,
    };
  }

  /**
   * Map an array of RoleResponse → Role[]
   */
  static fromResponseList(resList: RoleResponse[]): Role[] {
    return resList.map((res) => RoleMapper.fromResponse(res));
  }
}

export class PermissionMapper {
  /**
   * Map PermissionResponse (from API) → Permission (domain model)
   */
  static fromResponse(res: PermissionResponse): Permission {
    return new Permission({
      id: res.id,
      code: res.code,
      description: res.description,
    });
  }

  /**
   * Map Permission (domain model) → PermissionRequest (for create/update)
   */
  static toRequest(perm: Permission): PermissionRequest {
    return {
      code: perm.code,
      description: perm.description,
    };
  }

  /**
   * Map an array of PermissionResponse → Permission[]
   */
  static fromResponseList(resList: PermissionResponse[]): Permission[] {
    return resList.map((res) => PermissionMapper.fromResponse(res));
  }
}
