import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FinesFilterParams {
  search: string;
  reason: string;
  status: string;
}

@Component({
  selector: 'app-fines-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fines-filter-bar.html',
  styleUrls: ['./fines-filter-bar.scss'],
})
export class FinesFilterBarComponent {
  @Input() filters: FinesFilterParams = { search: '', reason: 'all', status: 'all' };
  @Output() filtersChange = new EventEmitter<FinesFilterParams>();
  @Output() onReset = new EventEmitter<void>();

  onSearchChange(value: string): void {
    this.filtersChange.emit({ ...this.filters, search: value });
  }

  onReasonChange(value: string): void {
    this.filtersChange.emit({ ...this.filters, reason: value });
  }

  onStatusChange(value: string): void {
    this.filtersChange.emit({ ...this.filters, status: value });
  }
}
