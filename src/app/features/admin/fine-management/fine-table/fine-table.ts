import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Fine, FINE_REASON_LABELS, FineReason } from '@model/fine';
import { FineTableFilter } from './fine-table-filter';

@Component({
  selector: 'app-fine-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fine-table.html',
  styleUrl: './fine-table.scss',
})
export class FineTableComponent {
  @Input() fines: Fine[] = [];
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;
  @Input() totalElements: number = 0;
  @Input() isLoading: boolean = false;

  @Output() pageChange = new EventEmitter<number>();
  @Output() filterChange = new EventEmitter<FineTableFilter>();
  @Output() viewFine = new EventEmitter<Fine>();
  @Output() deleteFine = new EventEmitter<Fine>();
  @Output() collectPayment = new EventEmitter<Fine>();
  @Output() waiveFine = new EventEmitter<Fine>();

  // Local filter state
  searchText: string = '';
  statusFilter: 'all' | 'pending' | 'paid' | 'waived' = 'all';
  dateRange: string = '';

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  get hasPrevious(): boolean {
    return this.currentPage > 0;
  }

  get hasNext(): boolean {
    return this.currentPage < this.totalPages - 1;
  }

  get filteredFines(): Fine[] {
    return this.fines;
  }

  getReasonLabel(reason: FineReason): string {
    return FINE_REASON_LABELS[reason] || reason;
  }

  getReasonClass(reason: FineReason): string {
    return `reason-${reason.toLowerCase()}`;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount);
  }

  formatDate(dateStr: string): { date: string; time: string } {
    if (!dateStr) return { date: '', time: '' };
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return {
      date: `${day}/${month}/${year}`,
      time: `${hours}:${minutes}`,
    };
  }

  getMemberName(fine: Fine): string {
    return fine.borrowDetail?.borrowRecord?.member?.user?.fullName || 'N/A';
  }

  getMemberCode(fine: Fine): string {
    return fine.borrowDetail?.borrowRecord?.member?.memberCode || 'N/A';
  }

  getMemberType(fine: Fine): string {
    return 'Độc giả'; // Could be enhanced with member type from API
  }

  getBookTitle(fine: Fine): string {
    return fine.borrowDetail?.book?.title || 'N/A';
  }

  getBorrowCode(fine: Fine): string {
    return `#BR-${fine.borrowId}`;
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts[parts.length - 1].charAt(0).toUpperCase();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  applyFilters(): void {
    this.filterChange.emit({
      search: this.searchText,
      status: this.statusFilter,
      startDate: this.dateRange ? this.dateRange.split(' - ')[0] : '',
      endDate: this.dateRange ? this.dateRange.split(' - ')[1] : '',
    });
  }

  onViewFine(fine: Fine): void {
    this.viewFine.emit(fine);
  }

  onDeleteFine(fine: Fine): void {
    this.deleteFine.emit(fine);
  }

  onCollectPayment(fine: Fine): void {
    this.collectPayment.emit(fine);
  }

  onWaiveFine(fine: Fine): void {
    this.waiveFine.emit(fine);
  }

  getStartIndex(): number {
    return this.currentPage * this.totalPages + 1;
  }

  getEndIndex(): number {
    const end = (this.currentPage + 1) * this.totalPages;
    return Math.min(end, this.totalElements);
  }
}
