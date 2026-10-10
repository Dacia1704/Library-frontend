import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

type TabKey = 'categories' | 'authors' | 'publishers';

@Component({
  selector: 'app-cat-auth-pub-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cat-auth-pub-toolbar.html',
  styleUrls: ['./cat-auth-pub-toolbar.scss'],
})
export class CatAuthPubToolbarComponent {
  @Input() activeTab: TabKey = 'categories';
  @Input() searchPlaceholder = 'Tìm kiếm...';
  @Input() showDeleted = true;
  @Input() deletedCount = 0;

  @Output() search = new EventEmitter<string>();
  @Output() statusFilter = new EventEmitter<string>();
  @Output() toggleDeleted = new EventEmitter<boolean>();
  @Output() refresh = new EventEmitter<void>();
  @Output() create = new EventEmitter<void>();

  private searchValue = '';

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchValue = input.value;
  }

  onSearchEnter(): void {
    this.search.emit(this.searchValue);
  }

  onStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.statusFilter.emit(select.value);
  }

  onToggleDeleted(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.toggleDeleted.emit(checkbox.checked);
  }

  onRefresh(): void {
    this.refresh.emit();
  }

  onCreate(): void {
    this.create.emit();
  }
}
