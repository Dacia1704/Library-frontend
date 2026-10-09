import { Component } from '@angular/core';

import { BorrowRecordHeaderComponent } from './borrow-record-header/borrow-record-header';
import { BorrowRecordTableComponent } from './borrow-record-table/borrow-record-table';

@Component({
  selector: 'app-admin-borrow-record',
  standalone: true,
  imports: [
    BorrowRecordHeaderComponent,
    BorrowRecordTableComponent,
  ],
  templateUrl: './borrow-record.html',
  styleUrls: ['./borrow-record.scss'],
})
export class AdminBorrowRecord {}
