import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { ApiResponse, PageResponse } from '@model/api-response';
import { User } from '@model/user/user.model';
import { UserFilter } from '@model/user/request/user-filter';
import { UserService } from '@core/services/user.service';
import { UserManagementHeaderComponent } from './user-management-header/user-management-header';
import { UserManagementToolbarComponent } from './user-management-toolbar/user-management-toolbar';
import { UserTableComponent } from './user-table/user-table';
import { ViewUserModalComponent } from './view-user-modal/view-user-modal';
import { EditUserModalComponent } from './edit-user-modal/edit-user-modal';
import { DeleteUserModalComponent } from './delete-user-modal/delete-user-modal';
import { CreateUserModalComponent } from './create-user-modal/create-user-modal';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    UserManagementHeaderComponent,
    UserManagementToolbarComponent,
    UserTableComponent,
    ViewUserModalComponent,
    EditUserModalComponent,
    DeleteUserModalComponent,
    CreateUserModalComponent,
  ],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.scss'],
})
export class UserManagement implements OnInit {
  @ViewChild(UserTableComponent) userTable!: UserTableComponent;

  users = signal<User[]>([]);
  totalElements = signal(0);
  totalPages = signal(0);
  currentPage = signal(0);
  pageSize = signal(20);
  isLoading = signal(false);
  filter = signal<UserFilter>({});

  // Modal states
  viewModalUser = signal<User | null>(null);
  editModalUser = signal<User | null>(null);
  deleteModalUser = signal<User | null>(null);
  createModalOpen = signal(false);

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  onFilterChanged(filter: UserFilter): void {
    this.filter.set(filter);
    this.currentPage.set(0);
    this.loadUsers();
  }

  onResetFilters(): void {
    if (this.userTable) {
      this.userTable.resetPagination();
    }
  }

  loadUsers(page: number = 0): void {
    this.isLoading.set(true);
    this.userService.getUsers(this.filter(), page, this.pageSize()).subscribe({
      next: (response: ApiResponse<PageResponse<User>>) => {
        console.log(response.data.data);
        this.users.set(response.data.data);
        this.totalElements.set(response.data.totalElements);
        this.totalPages.set(response.data.totalPages);
        this.currentPage.set(response.data.currentPage);
        this.pageSize.set(response.data.pageSize);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading.set(false);
      },
    });
  }

  onPageChanged(page: number): void {
    this.loadUsers(page);
  }

  onToggleUserStatus(userId: number, isActive: boolean): void {
    this.userService.setUserActive(userId, isActive).subscribe({
      next: () => {
        this.users.update(users =>
          users.map(u => {
            if (u.id === userId) {
              u.isActive = isActive;
            }
            return u;
          })
        );
      },
      error: (error) => {
        console.error('Error toggling user status:', error);
      },
    });
  }

  onDeleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.users.update(users => users.filter(u => u.id !== userId));
        this.totalElements.update(count => count - 1);
        this.deleteModalUser.set(null);
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.deleteModalUser.set(null);
      },
    });
  }

  // View Modal handlers
  onViewUser(user: User): void {
    this.viewModalUser.set(user);
  }

  closeViewModal(): void {
    this.viewModalUser.set(null);
  }

  openEditFromView(): void {
    const user = this.viewModalUser();
    if (user) {
      this.viewModalUser.set(null);
      this.editModalUser.set(user);
    }
  }

  // Edit Modal handlers
  onEditUser(user: User): void {
    this.editModalUser.set(user);
  }

  closeEditModal(): void {
    this.editModalUser.set(null);
  }

  onUserUpdated(updatedUser: User): void {
    this.users.update(users =>
      users.map(u => u.id === updatedUser.id ? updatedUser : u)
    );
    this.editModalUser.set(null);
  }

  // Delete Modal handlers
  openDeleteModal(user: User): void {
    this.deleteModalUser.set(user);
  }

  closeDeleteModal(): void {
    this.deleteModalUser.set(null);
  }

  confirmDelete(): void {
    const user = this.deleteModalUser();
    if (user) {
      this.onDeleteUser(user.id);
    }
  }

  // Create Modal handlers
  openCreateModal(): void {
    this.createModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.createModalOpen.set(false);
  }

  onUserCreated(newUser: User): void {
    this.users.update(users => [newUser, ...users]);
    this.totalElements.update(count => count + 1);
    this.closeCreateModal();
  }
}
