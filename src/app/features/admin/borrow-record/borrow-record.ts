import { Component, inject, OnInit, signal } from '@angular/core';
import { BorrowRecordHeaderComponent } from './borrow-record-header/borrow-record-header';
import { BorrowRecordTableComponent } from './borrow-record-table/borrow-record-table';
import { ViewBorrowRecordModalComponent } from './view-borrow-record-modal/view-borrow-record-modal';
import { BorrowRecordService } from '@services/borrow-record.service';
import { BorrowRecord } from '@model/borrow-record/borrow-record';
import { BorrowRecordFilter } from '@model/borrow-record/request/borrow-record-filter';

@Component({
  selector: 'app-admin-borrow-record',
  standalone: true,
  imports: [
    BorrowRecordHeaderComponent,
    BorrowRecordTableComponent,
    ViewBorrowRecordModalComponent,
  ],
  templateUrl: './borrow-record.html',
  styleUrls: ['./borrow-record.scss'],
})
export class AdminBorrowRecord implements OnInit {
  private borrowRecordService = inject(BorrowRecordService);

  // ===== State =====
  readonly records = signal<BorrowRecord[]>([]);
  readonly totalElements = signal(0);
  readonly currentPage = signal(0);
  readonly pageSize = signal(10);
  readonly isLoading = signal(false);

  readonly filter = signal<BorrowRecordFilter>({});
  readonly selectedRecord = signal<BorrowRecord | null>(null);

  ngOnInit(): void {
    this.loadRecords();
  }

  // ===== Data loading =====
  loadRecords(): void {
    this.isLoading.set(true);
    this.borrowRecordService
      .getPagination(this.filter(), this.currentPage(), this.pageSize())
      .subscribe({
        next: (res) => {
          if (res.code === 200) {
            this.records.set(res.data.data);
            this.totalElements.set(res.data.totalElements);
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  // ===== Filter =====
  onFilterChange(filter: BorrowRecordFilter): void {
    this.filter.set(filter);
    this.currentPage.set(0);
    this.loadRecords();
  }

  // ===== Pagination =====
  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadRecords();
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(0);
    this.loadRecords();
  }

  // ===== Table selection =====
  onViewRecord(record: BorrowRecord): void {
    this.selectedRecord.set(record);
  }

  onCloseModal(): void {
    this.selectedRecord.set(null);
  }
}
