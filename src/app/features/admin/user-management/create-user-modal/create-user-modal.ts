import { Component, inject, input, output, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '@services/user.service';
import { RoleService } from '@services/role.service';
import { Role } from '@model/role-permission/role.model';
import { UserRequest } from '@model/user/request/user-request';

@Component({
  selector: 'app-create-user-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-user-modal.html',
  styleUrl: './create-user-modal.scss',
})
export class CreateUserModalComponent implements OnInit {
  private userService = inject(UserService);
  private roleService = inject(RoleService);

  isOpen = input<boolean>(false);
  readonly closed = output<void>();
  readonly created = output<any>();

  // Form signals
  readonly username = signal('');
  readonly password = signal('');
  readonly fullName = signal('');
  readonly email = signal('');
  readonly roleId = signal<number | null>(null);

  readonly roles = signal<Role[]>([]);
  readonly isSubmitting = signal(false);
  readonly isLoadingRoles = signal(false);

  // Error message
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoadingRoles.set(true);
    this.roleService.getRoles().subscribe({
      next: (res) => {
        if (res.code === 200) {
          this.roles.set(res.data);
          // Set default role to first one if available
          if (res.data.length > 0 && this.roleId() === null) {
            this.roleId.set(res.data[0].id);
          }
        }
        this.isLoadingRoles.set(false);
      },
      error: () => {
        this.isLoadingRoles.set(false);
      }
    });
  }

  setUsername(value: string): void {
    this.username.set(value);
    this.clearError();
  }

  setPassword(value: string): void {
    this.password.set(value);
    this.clearError();
  }

  setFullName(value: string): void {
    this.fullName.set(value);
    this.clearError();
  }

  setEmail(value: string): void {
    this.email.set(value);
    this.clearError();
  }

  setRoleId(value: string): void {
    const id = parseInt(value, 10);
    this.roleId.set(isNaN(id) ? null : id);
    this.clearError();
  }

  clearError(): void {
    this.errorMessage.set(null);
  }

  resetForm(): void {
    this.username.set('');
    this.password.set('');
    this.fullName.set('');
    this.email.set('');
    this.roleId.set(this.roles().length > 0 ? this.roles()[0].id : null);
    this.errorMessage.set(null);
  }

  close(): void {
    if (this.isSubmitting()) return;
    this.resetForm();
    this.closed.emit();
  }

  submit(event: Event): void {
    event.preventDefault();

    // Validation
    if (!this.username().trim()) {
      this.errorMessage.set('Tên đăng nhập không được để trống');
      return;
    }
    if (this.password().length < 6) {
      this.errorMessage.set('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (!this.fullName().trim()) {
      this.errorMessage.set('Họ và tên không được để trống');
      return;
    }
    if (!this.email().trim() || !this.email().includes('@')) {
      this.errorMessage.set('Email không hợp lệ');
      return;
    }
    if (this.roleId() === null) {
      this.errorMessage.set('Vui lòng chọn vai trò');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const request: UserRequest = {
      username: this.username().trim(),
      password: this.password(),
      fullName: this.fullName().trim(),
      email: this.email().trim(),
      roleId: this.roleId()!,
    };

    this.userService.createUser(request).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.code === 200) {
          this.created.emit(res.data);
          this.resetForm();
          this.closed.emit();
        } else {
          this.errorMessage.set(res.message || 'Có lỗi xảy ra');
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'Có lỗi xảy ra khi tạo người dùng');
      }
    });
  }
}
