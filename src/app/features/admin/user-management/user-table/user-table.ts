import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Member } from '@model/member/member.model';
import { ImageUtils } from '@shared/utils/image-utils';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './user-table.html',
  styleUrl: './user-table.scss',
})
export class UserTableComponent implements OnChanges {

  @Input() membersInput: Member[] = [];
  @Input() totalElementsInput = 0;
  @Input() totalPagesInput = 0;
  @Input() currentPageInput = 0;
  @Input() pageSizeInput = 20;
  @Input() isLoadingInput = false;

  @Output() pageChanged = new EventEmitter<number>();
  @Output() toggleUserStatus = new EventEmitter<{ userId: number; isActive: boolean }>();
  @Output() deleteUser = new EventEmitter<number>();
  @Output() viewUser = new EventEmitter<Member>();
  @Output() editUser = new EventEmitter<Member>();

  readonly pageSizeOptions = [10, 20, 50, 100];

  // Internal state for template
  _members: Member[] = [];
  _totalElements = 0;
  _totalPages = 0;
  _currentPage = 0;
  _pageSize = 20;
  _isLoading = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['membersInput']) {
      this._members = this.membersInput;
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

  get members(): Member[] {
    return this._members;
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

  getUserAvatarSrc(member: Member): string {
    return ImageUtils.toImageSrc(member.user.avatar);
  }

  getUserAvatarInitials(member: Member): string {
    const name = member.user.fullName || member.user.username;
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getUserAvatarColor(member: Member): 'primary' | 'secondary' | 'default' | 'error' {
    const role = member.user.roleName?.toLowerCase() || '';
    if (role.includes('admin')) return 'primary';
    if (role.includes('thủ thư') || role.includes('librarian')) return 'secondary';
    if (!member.user.isActive) return 'error';
    return 'default';
  }

  getRoleLabel(roleName: string): string {
    const role = roleName?.toLowerCase() || '';
    if (role.includes('admin')) return 'Quản trị viên';
    if (role.includes('thủ thư') || role.includes('librarian')) return 'Thủ thư';
    if (role.includes('độc giả') || role.includes('reader') || role.includes('member')) return 'Độc giả';
    return roleName;
  }

  getRoleIcon(roleName: string): string {
    const role = roleName?.toLowerCase() || '';
    if (role.includes('admin')) return 'security';
    if (role.includes('thủ thư') || role.includes('librarian')) return 'menu_book';
    return 'person';
  }

  getMemberCode(member: Member): string | null {
    return member.memberCode || null;
  }

  hasMemberCard(member: Member): boolean {
    return !!member.memberCode;
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN');
  }

  onToggleStatus(member: Member): void {
    this.toggleUserStatus.emit({
      userId: member.user.id,
      isActive: !member.user.isActive,
    });
  }

  onView(member: Member): void {
    this.viewUser.emit(member);
  }

  onEdit(member: Member): void {
    this.editUser.emit(member);
  }

  onDelete(member: Member): void {
    this.deleteUser.emit(member.user.id);
  }
}
