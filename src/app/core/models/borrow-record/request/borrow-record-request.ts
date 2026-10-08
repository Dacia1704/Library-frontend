export interface BorrowRecordRequest {
  memberId: string;
  librarianId: string;
  borrowDate: string;   // ISO date string (LocalDate)
  dayBorrow: number;
  note?: string;
  bookIds: string[];    // NotEmpty, NotNull
}