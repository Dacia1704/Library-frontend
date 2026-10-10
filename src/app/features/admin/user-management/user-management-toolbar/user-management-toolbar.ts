import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserFilter } from '@model/user/request/user-filter';

@Component({
  selector: 'app-user-management-toolbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-management-toolbar.html',
  styleUrl: './user-management-toolbar.scss',
})
export class UserManagementToolbarComponent implements OnInit {

  @Output() filterChanged = new EventEmitter<UserFilter>();
  @Output() resetFiltersEvent = new EventEmitter<void>();

  searchKeyword = '';
  searchEmail = '';
  selectedRoleId: number | null = null;
  isMember: boolean | null = null;
  searchPhone = '';

  readonly roles = [
    { value: null, label: 'Tất cả vai trò' },
    { value: 1, label: 'Quản trị viên (Admin)' },
    { value: 2, label: 'Thủ thư' },
    { value: 3, label: 'Thành viên' },
    { value: 4, label: 'Độc giả' },
  ];

  readonly memberStatuses = [
    { value: null, label: 'Tất cả' },
    { value: true, label: 'Có thẻ thành viên' },
    { value: false, label: 'Không có thẻ' },
  ];

  ngOnInit(): void {
    this.emitFilter();
  }

  onFilterChange(): void {
    this.emitFilter();
  }

  private emitFilter(): void {
    const filter: UserFilter = {};
    
    if (this.searchKeyword.trim()) {
      filter.keyword = this.searchKeyword.trim();
    }
    if (this.searchEmail.trim()) {
      filter.email = this.searchEmail.trim();
    }
    if (this.selectedRoleId !== null) {
      filter.roleId = this.selectedRoleId;
    }
    if (this.isMember !== null) {
      filter.isMember = this.isMember;
    }
    if (this.searchPhone.trim()) {
      filter.phone = this.searchPhone.trim();
    }

    this.filterChanged.emit(filter);
  }

  resetFilters(): void {
    this.searchKeyword = '';
    this.searchEmail = '';
    this.selectedRoleId = null;
    this.isMember = null;
    this.searchPhone = '';
    this.emitFilter();
    this.resetFiltersEvent.emit();
  }
}
