import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface BorrowRecord {
  id: string;
  patronName: string;
  patronCard: string;
  patronType: string;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
  status: 'borrowing' | 'returned' | 'overdue';
  statusText: string;
  librarian: string;
  librarianDesk: string;
  overdueDays?: number;
}

@Component({
  selector: 'app-borrow-record-table',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './borrow-record-table.html',
  styleUrl: './borrow-record-table.scss',
})
export class BorrowRecordTableComponent {

  readonly records: BorrowRecord[] = [
    {
      id: 'PM-2025-0912',
      patronName: 'Nguyễn Văn An',
      patronCard: 'MBR-0842',
      patronType: 'Sinh viên K45',
      bookTitle: 'Giải thuật & Cấu trúc dữ liệu',
      borrowDate: '10/10/2025',
      dueDate: '24/10/2025',
      status: 'overdue',
      statusText: 'Quá hạn',
      librarian: 'Trần Mỹ Duyên',
      librarianDesk: 'Quầy số 02',
      overdueDays: 5,
    },
    {
      id: 'PM-2025-0911',
      patronName: 'Trần Thị Thu Thảo',
      patronCard: 'MBR-1209',
      patronType: 'Học viên cao học',
      bookTitle: 'Trí tuệ nhân tạo hiện đại: Tiếp cận thông minh',
      borrowDate: '18/10/2025',
      dueDate: '01/11/2025',
      status: 'borrowing',
      statusText: 'Đang mượn',
      librarian: 'Lê Hoàng Long',
      librarianDesk: 'Admin trực quầy',
    },
    {
      id: 'PM-2025-0845',
      patronName: 'Phạm Quốc Bảo',
      patronCard: 'MBR-0315',
      patronType: 'Giảng viên',
      bookTitle: 'Kinh tế học vĩ mô ứng dụng',
      borrowDate: '05/10/2025',
      dueDate: '19/10/2025',
      status: 'returned',
      statusText: 'Đã trả',
      librarian: 'Vũ Khánh Huyền',
      librarianDesk: 'Quầy số 01',
    },
  ];

  readonly pageSizeOptions = [8, 15, 30, 50];
  currentPage = 1;
  pageSize = 8;
  totalRecords = 1250;

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }
}
