import { Permission } from './permission.model';

export class Role {
  id: number;
  name: string;
  description: string;
  permissionIds: number[];
  // Optional UI metadata (not from API)
  isSystem?: boolean;
  isDefault?: boolean;
  userCount?: number;
  permissionCount?: number;

  constructor(data: Partial<Role> = {}) {
    this.id = data.id ?? 0;
    this.name = data.name ?? '';
    this.description = data.description ?? '';
    this.permissionIds = data.permissionIds ?? [];
    this.isSystem = data.isSystem;
    this.isDefault = data.isDefault;
    this.userCount = data.userCount ?? 0;
    this.permissionCount = data.permissionCount;
  }

  /**
   * Get permission count percentage (out of maxPermissions, default 32)
   */
  getPermissionPercent(maxPermissions = 32): number {
    if (!this.permissionCount && this.permissionCount !== 0) {
      return Math.round((this.permissionIds.length / maxPermissions) * 100);
    }
    return Math.round((this.permissionCount / maxPermissions) * 100);
  }
}
