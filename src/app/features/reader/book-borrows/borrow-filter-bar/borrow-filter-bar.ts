import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BorrowStatus } from '@model/enum/borrow-status.enum';

export interface BorrowStatChip {
  key: BorrowStatus | 'all';
  label: string;
  count: number;
  tone: 'primary' | 'secondary' | 'muted' | 'error';
}

export interface BorrowFilterValue {
  status: BorrowStatus | 'all' | null;
  keyword: string;
}

@Component({
  selector: 'app-borrow-filter-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './borrow-filter-bar.html',
  styleUrls: ['./borrow-filter-bar.scss'],
})
export class BorrowFilterBar {
  @Input({ required: true }) chips: BorrowStatChip[] = [];
  @Input({ required: true }) activeStatus: BorrowStatus | 'all' | null = null;

  @Output() filterChange = new EventEmitter<BorrowFilterValue>();

  keyword: string = '';
  dateRange: string = 'all';
  sortBy: string = 'newest';

  dateRangeOptions = [
    { value: 'all', label: 'Tất cả thời gian' },
    { value: '30d', label: '30 ngày gần đây' },
    { value: 'school-year', label: 'Năm học 2024 - 2025' },
    { value: 'h1-2024', label: 'Học kỳ 1 (2024)' },
  ];

  sortOptions = [
    { value: 'newest', label: 'Mới nhất trước' },
    { value: 'due-soonest', label: 'Hạn trả gần nhất' },
    { value: 'fine-desc', label: 'Mức tiền phạt giảm dần' },
    { value: 'code-asc', label: 'Mã phiếu mượn (A-Z)' },
  ];

  pickStatus(status: BorrowStatus | 'all' | null) {
    this.activeStatus = status;
    this.emit();
  }

  onKeywordInput() {
    this.emit();
  }

  onDateRangeChange() {
    this.emit();
  }

  onSortChange() {
    this.emit();
  }

  private emit() {
    this.filterChange.emit({
      status: this.activeStatus,
      keyword: this.keyword,
    });
  }
}
