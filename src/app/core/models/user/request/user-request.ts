export interface UserRequest {
  username: string;         // max 50
  password: string;         // min 6, max 100
  fullName: string;         // max 100
  email: string;            // max 100
  identityNumber: string;   // max 12
  avatar?: string;
  roleId: number;
  isActive?: boolean;
}