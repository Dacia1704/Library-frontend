import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management-toolbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-management-toolbar.html',
  styleUrl: './user-management-toolbar.scss',
})
export class UserManagementToolbarComponent {

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

  resetFilters(): void {
    this.searchName = '';
    this.searchEmail = '';
    this.selectedRole = '';
    this.selectedCardStatus = '';
    this.searchPhone = '';
    this.showDeleted = false;
  }
}
