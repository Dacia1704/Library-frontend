import { Component, EventEmitter, Input, Output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface RecordCardData {
  recordId: string;
  recordCode: string;
  createdAt: string;
  status: 'borrowing' | 'overdue' | 'returned';
  overdueDays?: number;
  memberName: string;
  memberCode: string;
  memberRole: string;
  phone: string;
  email: string;
  borrowDate: string;
  dueDate: string;
  borrowDays: number;
  totalBooks: number;
  returnedCount: number;
  librarianName: string;
}

@Component({
  selector: 'app-return-book-record-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './return-book-record-card.html',
  styleUrls: ['./return-book-record-card.scss'],
})
export class ReturnBookRecordCardComponent {
  @Input() set data(value: RecordCardData | null) {
    this._data.set(value);
  }
  @Output() onProcessReturn = new EventEmitter<void>();

  private _data = signal<RecordCardData | null>(null);
  
  get record(): RecordCardData | null {
    return this._data();
  }

  get hasRecord(): boolean {
    return this._data() !== null;
  }

  get isOverdue(): boolean {
    return this._data()?.status === 'overdue';
  }

  get progressPercent(): number {
    const data = this._data();
    if (!data || data.totalBooks === 0) return 0;
    return Math.round((data.returnedCount / data.totalBooks) * 100);
  }

  get today(): string {
    const d = new Date();
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  processReturn(): void {
    this.onProcessReturn.emit();
  }
}
