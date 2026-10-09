import { Component, output, signal } from '@angular/core';
import { BorrowRecordFilter } from '@model/borrow-record/request/borrow-record-filter';
import { BorrowStatus } from '@model/enum/borrow-status.enum';

@Component({
  selector: 'app-borrow-record-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './borrow-record-toolbar.html',
  styleUrls: ['./borrow-record-toolbar.scss'],
})
export class BorrowRecordToolbarComponent {
  readonly filterChange = output<BorrowRecordFilter>();

  readonly memberKeyword = signal('');
  readonly bookKeyword = signal('');
  readonly startDate = signal('');
  readonly endDate = signal('');
  readonly status = signal<BorrowStatus | ''>('');

  readonly statuses = [
    { value: '', label: 'Trạng thái: Tất cả' },
    { value: BorrowStatus.BORROWING, label: 'Đang mượn' },
    { value: BorrowStatus.RETURNED, label: 'Đã trả' },
    { value: BorrowStatus.OVERDUE, label: 'Quá hạn' },
  ];

  onApply(): void {
    this.emitFilter();
  }

  onReset(): void {
    this.memberKeyword.set('');
    this.bookKeyword.set('');
    this.startDate.set('');
    this.endDate.set('');
    this.status.set('');
    this.emitFilter();
  }

  private emitFilter(): void {
    this.filterChange.emit({
      memberKeyword: this.memberKeyword() || undefined,
      bookKeyword: this.bookKeyword() || undefined,
      startBorrowDate: this.startDate() || undefined,
      endBorrowDate: this.endDate() || undefined,
      status: this.status() || undefined,
    });
  }
}
