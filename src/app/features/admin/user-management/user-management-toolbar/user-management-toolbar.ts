import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MemberFilter } from '@model/member/request/member-filter';

@Component({
  selector: 'app-user-management-toolbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-management-toolbar.html',
  styleUrl: './user-management-toolbar.scss',
})
export class UserManagementToolbarComponent implements OnInit {

  @Output() filterChanged = new EventEmitter<MemberFilter>();
  @Output() resetFiltersEvent = new EventEmitter<void>();

  searchName = '';
  searchEmail = '';
  selectedRole = '';
  selectedCardStatus = '';
  searchPhone = '';
  showDeleted = false;

  readonly roles = [
    { value: '', label: 'Tất cả vai trò' },
    { value: 'admin', label: 'Quản trị viên (Admin)' },
    { value: 'librarian', label: 'Thủ thư' },
    { value: 'reader', label: 'Độc giả' },
  ];

  readonly cardStatuses = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'has_card', label: 'Đã có thẻ (Có)' },
    { value: 'no_card', label: 'Chưa làm thẻ (Không)' },
  ];

  ngOnInit(): void {
    // Emit initial filter on component init
    this.emitFilter();
  }

  onFilterChange(): void {
    this.emitFilter();
  }

  private emitFilter(): void {
    const filter: MemberFilter = {};
    
    // Combine searchName into keyword for full-text search
    if (this.searchName.trim()) {
      filter.keyword = this.searchName.trim();
    }
    if (this.searchEmail.trim()) {
      filter.email = this.searchEmail.trim();
    }
    if (this.selectedRole) {
      filter.role = this.selectedRole;
    }
    if (this.selectedCardStatus) {
      filter.cardStatus = this.selectedCardStatus;
    }
    if (this.searchPhone.trim()) {
      filter.phone = this.searchPhone.trim();
    }
    if (this.showDeleted) {
      filter.showDeleted = true;
    }

    this.filterChanged.emit(filter);
  }

  resetFilters(): void {
    this.searchName = '';
    this.searchEmail = '';
    this.selectedRole = '';
    this.selectedCardStatus = '';
    this.searchPhone = '';
    this.showDeleted = false;
    this.emitFilter();
    this.resetFiltersEvent.emit();
  }
}
