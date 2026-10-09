import { Component, inject, OnInit, signal } from '@angular/core';
import { BorrowRecordBreadcrumbComponent } from './borrow-record-breadcrumb/borrow-record-breadcrumb';
import { BorrowRecordHeaderComponent } from './borrow-record-header/borrow-record-header';
import { BorrowRecordToolbarComponent } from './borrow-record-toolbar/borrow-record-toolbar';
import { BorrowRecordTableComponent } from './borrow-record-table/borrow-record-table';
import { BorrowRecordDrawerComponent } from './borrow-record-drawer/borrow-record-drawer';
import { BorrowRecordService } from '@services/borrow-record.service';
import { BorrowRecord as BorrowRecordModel } from '@model/borrow-record/borrow-record';
import { BorrowRecordFilter } from '@model/borrow-record/request/borrow-record-filter';

@Component({
  selector: 'app-borrow-record-page',
  standalone: true,
  imports: [
    BorrowRecordBreadcrumbComponent,
    BorrowRecordHeaderComponent,
    BorrowRecordToolbarComponent,
    BorrowRecordTableComponent,
    BorrowRecordDrawerComponent,
  ],
  templateUrl: './borrow-record.html',
  styleUrls: ['./borrow-record.scss'],
})
export class BorrowRecordPage implements OnInit {
  private borrowRecordService = inject(BorrowRecordService);

  // ===== State =====
  readonly records = signal<BorrowRecordModel[]>([]);
  readonly totalElements = signal(0);
  readonly currentPage = signal(0);
  readonly pageSize = signal(10);
  readonly isLoading = signal(false);

  readonly filter = signal<BorrowRecordFilter>({});
  readonly selectedRecord = signal<BorrowRecordModel | null>(null);

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
          console.log(res);
          if (res.code === 200) {
            this.records.set(res.data.data);
            this.totalElements.set(res.data.totalElements);
            // Auto select first item if drawer is empty
            if (res.data.data.length > 0 && this.selectedRecord() === null) {
              this.selectedRecord.set(res.data.data[0]);
            }
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
  onSelectRecord(record: BorrowRecordModel): void {
    this.selectedRecord.set(record);
  }

  onCloseDrawer(): void {
    this.selectedRecord.set(null);
  }

  // ===== Computed =====
  get totalPages(): number {
    const total = this.totalElements();
    const size = this.pageSize();
    if (total === 0 || size === 0) return 1;
    return Math.ceil(total / size);
  }
}
