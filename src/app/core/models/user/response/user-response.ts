import { MemberResponse } from "@model/member/response/member-response";

export interface UserResponse {
  id: number;
  username: string;
  fullName: string;
  email: string;
  avatar?: string;
  roleId: number;
  roleName: string;
  isActive: boolean;
  createdAt: string; // ISO datetime string (LocalDateTime)
  member: MemberResponse;
}