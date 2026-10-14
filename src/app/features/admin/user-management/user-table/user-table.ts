import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '@model/user/user.model';
import { Member } from '@model/member/member.model';
import { CardStatus } from '@model/enum/card-status.enum';
import { ImageUtils } from '@shared/utils/image-utils';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './user-table.html',
  styleUrl: './user-table.scss',
})
export class UserTableComponent implements OnChanges {

  @Input() usersInput: User[] = [];
  @Input() totalElementsInput = 0;
  @Input() totalPagesInput = 0;
  @Input() currentPageInput = 0;
  @Input() pageSizeInput = 20;
  @Input() isLoadingInput = false;

  @Output() pageChanged = new EventEmitter<number>();
  @Output() toggleUserStatus = new EventEmitter<{ userId: number; isActive: boolean }>();
  @Output() deleteUser = new EventEmitter<User>();
  @Output() viewUser = new EventEmitter<User>();
  @Output() editUser = new EventEmitter<User>();

  readonly pageSizeOptions = [10, 20, 50, 100];

  // Internal state for template
  _users: User[] = [];
  _totalElements = 0;
  _totalPages = 0;
  _currentPage = 0;
  _pageSize = 20;
  _isLoading = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usersInput']) {
      this._users = this.usersInput;
    }
    if (changes['totalElementsInput']) {
      this._totalElements = this.totalElementsInput;
    }
    if (changes['totalPagesInput']) {
      this._totalPages = this.totalPagesInput;
    }
    if (changes['currentPageInput']) {
      this._currentPage = this.currentPageInput;
    }
    if (changes['pageSizeInput']) {
      this._pageSize = this.pageSizeInput;
    }
    if (changes['isLoadingInput']) {
      this._isLoading = this.isLoadingInput;
    }
  }

  get users(): User[] {
    return this._users;
  }

  get totalElements(): number {
    return this._totalElements;
  }

  get totalPages(): number {
    return this._totalPages;
  }

  get currentPage(): number {
    return this._currentPage;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7) {
      for (let i = 0; i < total; i++) pages.push(i);
    } else {
      pages.push(0);
      if (current > 3) pages.push(-1);
      
      const start = Math.max(1, current - 1);
      const end = Math.min(total - 2, current + 1);
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (current < total - 3) pages.push(-1);
      pages.push(total - 1);
    }
    
    return pages;
  }

  get displayedRange(): { start: number; end: number } {
    if (this.totalElements === 0) {
      return { start: 0, end: 0 };
    }
    const start = this.currentPage * this.pageSize + 1;
    const end = Math.min(start + this.pageSize - 1, this.totalElements);
    return { start, end };
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.pageChanged.emit(page);
    }
  }

  onPageSizeChange(): void {
    this.pageChanged.emit(0);
  }

  resetPagination(): void {
    this.pageChanged.emit(0);
  }

  getUserAvatarSrc(user: User): string {
    return ImageUtils.toImageSrc(user.avatar, 'avatar-default.jpg');
  }

  getUserAvatarInitials(user: User): string {
    const name = user.fullName || user.username;
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getUserAvatarColor(user: User): 'primary' | 'secondary' | 'default' | 'error' {
    const role = user.roleName?.toLowerCase() || '';
    if (role.includes('admin')) return 'primary';
    if (role.includes('thủ thư') || role.includes('librarian')) return 'secondary';
    if (!user.isActive) return 'error';
    return 'default';
  }

  getRoleLabel(roleName: string): string {
    const role = roleName?.toLowerCase() || '';
    if (role.includes('admin')) return 'Quản trị viên';
    if (role.includes('librarian')) return 'Thủ thư';
    if (role.includes('reader')) return 'Độc giả';
    if (role.includes('member')) return 'Thành viên';
    return roleName;
  }

  getRoleIcon(roleName: string): string {
    const role = roleName?.toLowerCase() || '';
    if (role.includes('admin')) return 'security';
    if (role.includes('librarian')) return 'menu_book';
    if (role.includes('reader')) return 'person';
    if (role.includes('member')) return 'badge';
    return 'person';
  }

  // Card Status methods
  getCardStatusLabel(cardStatus: CardStatus): string {
    return cardStatus === CardStatus.ISSUED ? 'Đã cấp' : 'Chờ cấp';
  }

  getCardStatusIcon(cardStatus: CardStatus): string {
    return cardStatus === CardStatus.ISSUED ? 'verified_user' : 'hourglass_empty';
  }

  getCardStatusClass(cardStatus: CardStatus): string {
    return cardStatus === CardStatus.ISSUED ? 'card-issued' : 'card-pending';
  }

  isCardExpired(member: Member): boolean {
    return member.cardExpiry < new Date();
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN');
  }

  onToggleStatus(user: User): void {
    this.toggleUserStatus.emit({
      userId: user.id,
      isActive: !user.isActive,
    });
  }

  onView(user: User): void {
    this.viewUser.emit(user);
  }

  onEdit(user: User): void {
    this.editUser.emit(user);
  }

  onDelete(user: User): void {
    this.deleteUser.emit(user);
  }
}
