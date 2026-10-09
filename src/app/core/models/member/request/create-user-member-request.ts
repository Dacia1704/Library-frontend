export interface CreateUserMemberRequest {
  /** Username for login (max 50) */
  username: string;
  /** Initial password (min 6, max 100) */
  password: string;
  /** Full display name (max 100) */
  fullName: string;
  /** Contact email (max 100) */
  email: string;
  /** Base64 avatar string (optional) */
  avatar?: string;
  /** CCCD / Identity number (exactly 12 digits) */
  identityNumber: string;
  /** Phone number (max 15, optional) */
  phone?: string;
  /** Address (max 255, optional) */
  address?: string;
  /** Initial card payment amount (optional) */
  amount?: number;
  monthRequest?: number;
}
