export interface MemberFilter {
  /** Search by keyword (fullName, username, email, phone, identityNumber) */
  keyword?: string;
  /** Filter by role: admin, librarian, reader */
  role?: string;
  /** Filter by card status: has_card, no_card */
  cardStatus?: string;
  /** Filter by email */
  email?: string;
  /** Filter by phone number */
  phone?: string;
  /** Include deleted (soft-deleted) members */
  showDeleted?: boolean;
}
