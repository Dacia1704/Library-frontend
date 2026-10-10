import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FineManagementHeaderComponent } from './fine-management-header/fine-management-header';
import { FineTableComponent } from './fine-table/fine-table';
import { FinePaymentTableComponent } from './fine-payment-table/fine-payment-table';

import { Fine, FinePayment } from '@model/fine';
import { FineService } from '@core/services/fine.service';
import { FinePaymentService } from '@core/services/fine-payment.service';
import { FineTableFilter } from './fine-table/fine-table-filter';

type FineTab = 'FINES' | 'PAYMENTS';

@Component({
  selector: 'app-fine-management',
  standalone: true,
  imports: [
    CommonModule,
    FineManagementHeaderComponent,
    FineTableComponent,
    FinePaymentTableComponent,
  ],
  templateUrl: './fine-management.html',
  styleUrls: ['./fine-management.scss'],
})
export class FineManagement implements OnInit {
  private readonly fineService = inject(FineService);
  private readonly finePaymentService = inject(FinePaymentService);

  // === Tab State ===
  activeTab = signal<FineTab>('FINES');

  // === Fine Data ===
  fines = signal<Fine[]>([]);
  finePage = signal<number>(0);
  fineSize = 10;
  fineTotalElements = signal<number>(0);
  fineTotalPages = signal<number>(0);
  fineLoading = signal<boolean>(false);

  // === Payment Data ===
  payments = signal<FinePayment[]>([]);
  paymentPage = signal<number>(0);
  paymentSize = 10;
  paymentTotalElements = signal<number>(0);
  paymentTotalPages = signal<number>(0);
  paymentLoading = signal<boolean>(false);

  // === Filter State ===
  currentFilter = signal<FineTableFilter>({
    search: '',
    status: 'all',
    startDate: '',
    endDate: '',
  });

  // === Stats for Header ===
  totalPendingAmount = signal<number>(0);
  totalPendingCount = signal<number>(0);
  totalPaidAmount = signal<number>(0);

  ngOnInit(): void {
    this.loadFines();
    this.loadPayments();
    this.loadStats();
  }

  // === Tab Switching ===
  setActiveTab(tab: FineTab): void {
    this.activeTab.set(tab);
  }

  // === Load Fines ===
  loadFines(page: number = 0): void {
    this.fineLoading.set(true);
    this.fineService.getAll(undefined, page, this.fineSize).subscribe({
      next: (response) => {
        this.fines.set(response.data);
        this.finePage.set(response.currentPage);
        this.fineTotalElements.set(response.totalElements);
        this.fineTotalPages.set(response.totalPages);
        this.fineLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading fines:', err);
        this.fineLoading.set(false);
      },
    });
  }

  // === Load Payments ===
  loadPayments(page: number = 0): void {
    this.paymentLoading.set(true);
    this.finePaymentService.getAll(undefined, page, this.paymentSize).subscribe({
      next: (response) => {
        this.payments.set(response.data);
        this.paymentPage.set(response.currentPage);
        this.paymentTotalElements.set(response.totalElements);
        this.paymentTotalPages.set(response.totalPages);
        this.paymentLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading payments:', err);
        this.paymentLoading.set(false);
      },
    });
  }

  // === Load Stats ===
  private loadStats(): void {
    // Calculate pending amount from fines data (where isDeleted = false)
    this.fineService.getAll(undefined, 0, 1000).subscribe({
      next: (response) => {
        const pendingFines = response.data.filter(f => !f.isDeleted);
        this.totalPendingCount.set(pendingFines.length);
        this.totalPendingAmount.set(
          pendingFines.reduce((sum, f) => sum + f.amount, 0)
        );
      },
      error: (err) => console.error('Error loading fines stats:', err),
    });

    // Calculate total paid from payments
    this.finePaymentService.getAll(undefined, 0, 1000).subscribe({
      next: (response) => {
        this.totalPaidAmount.set(
          response.data.reduce((sum, p) => sum + p.amount, 0)
        );
      },
      error: (err) => console.error('Error loading payments stats:', err),
    });
  }

  // === Pagination Handlers ===
  onFinePageChange(page: number): void {
    this.loadFines(page);
  }

  onPaymentPageChange(page: number): void {
    this.loadPayments(page);
  }

  // === Filter Handler ===
  onFilterChange(filter: FineTableFilter): void {
    this.currentFilter.set(filter);
    this.loadFines(0);
  }

  // === Refresh ===
  refresh(): void {
    this.loadFines();
    this.loadPayments();
    this.loadStats();
  }
}
