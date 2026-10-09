import { Component, OnInit, ViewChild, signal, computed } from '@angular/core';
import { ApiResponse, PageResponse } from '@model/api-response';
import { Member } from '@model/member/member.model';
import { MemberFilter } from '@model/member/request/member-filter';
import { MemberService } from '@core/services/member.service';
import { UserManagementHeaderComponent } from './user-management-header/user-management-header';
import { UserManagementToolbarComponent } from './user-management-toolbar/user-management-toolbar';
import { UserTableComponent } from './user-table/user-table';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    UserManagementHeaderComponent,
    UserManagementToolbarComponent,
    UserTableComponent,
  ],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.scss'],
})
export class UserManagement implements OnInit {
  @ViewChild(UserTableComponent) userTable!: UserTableComponent;

  members = signal<Member[]>([]);
  totalElements = signal(0);
  totalPages = signal(0);
  currentPage = signal(0);
  pageSize = signal(20);
  isLoading = signal(false);
  filter = signal<MemberFilter>({});

  constructor(private memberService: MemberService) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  onFilterChanged(filter: MemberFilter): void {
    this.filter.set(filter);
    this.currentPage.set(0);
    this.loadMembers();
  }

  onResetFilters(): void {
    if (this.userTable) {
      this.userTable.resetPagination();
    }
  }

  loadMembers(page: number = 0): void {
    this.isLoading.set(true);
    this.memberService.getPagination(this.filter(), page, this.pageSize()).subscribe({
      next: (response: ApiResponse<PageResponse<Member>>) => {
        this.members.set(response.data.data);
        this.totalElements.set(response.data.totalElements);
        this.totalPages.set(response.data.totalPages);
        this.currentPage.set(response.data.currentPage);
        this.pageSize.set(response.data.pageSize);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading members:', error);
        this.isLoading.set(false);
      },
    });
  }

  onPageChanged(page: number): void {
    this.loadMembers(page);
  }

  onToggleUserStatus(userId: number, isActive: boolean): void {
    this.memberService.setUserActive(userId, isActive).subscribe({
      next: () => {
        this.members.update(members =>
          members.map(m => {
            if (m.user.id === userId) {
              m.user.isActive = isActive;
            }
            return m;
          })
        );
      },
      error: (error) => {
        console.error('Error toggling user status:', error);
      },
    });
  }

  onDeleteUser(userId: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      this.memberService.deleteMember(userId).subscribe({
        next: () => {
          this.members.update(members => members.filter(m => m.user.id !== userId));
          this.totalElements.update(count => count - 1);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        },
      });
    }
  }

  onViewUser(member: Member): void {
    console.log('View user:', member);
  }

  onEditUser(member: Member): void {
    console.log('Edit user:', member);
  }
}
