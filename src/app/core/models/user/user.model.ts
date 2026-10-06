import { Member } from '../member/member.model';

export class User {
  id: number;
  username: string;
  fullName: string;
  noAccent: string;
  email: string;
  avatar?: string;
  roleId: number;
  roleName: string;
  isActive: boolean;
  failedAttempts: number;
  createdAt: Date;
  isDeleted: boolean;

  constructor(data: Partial<User> = {}) {
    this.id = data.id ?? 0;
    this.username = data.username ?? '';
    this.fullName = data.fullName ?? '';
    this.noAccent = data.noAccent ?? '';
    this.email = data.email ?? '';
    this.avatar = data.avatar;
    this.roleId = data.roleId ?? 0;
    this.roleName = data.roleName ?? '';
    this.isActive = data.isActive ?? true;
    this.failedAttempts = data.failedAttempts ?? 0;
    this.createdAt = data.createdAt ?? new Date();
    this.isDeleted = data.isDeleted ?? false;
  }

  get displayName(): string {
    return this.fullName || this.username;
  }
}