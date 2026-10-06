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
}