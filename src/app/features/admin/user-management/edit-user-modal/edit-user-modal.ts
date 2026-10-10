import { Component, inject, input, output, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '@model/user/user.model';
import { MemberService } from '@services/member.service';
import { UserService } from '@services/user.service';
import { MemberUpdateRequest } from '@model/member/request/member-update-request';
import { UserRequest } from '@model/user/request/user-request';
import { CardStatus } from '@model/enum/card-status.enum';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-user-modal.html',
  styleUrl: './edit-user-modal.scss',
})
export class EditUserModalComponent {
  private memberService = inject(MemberService);
  private userService = inject(UserService);

  isOpen = input<boolean>(false);
  user = input<User | null>(null);
  readonly closed = output<void>();
  readonly updated = output<User>();

  // User fields
  readonly username = signal('');
  readonly password = signal('');
  readonly email = signal('');
  readonly fullName = signal('');
  readonly isActive = signal(true);
  readonly roleId = signal<number>(0);

  // Member fields
  readonly identityNumber = signal('');
  readonly phone = signal('');
  readonly address = signal('');
  readonly cardStatus = signal<CardStatus>(CardStatus.PENDING);

  readonly isSubmitting = signal(false);
  readonly isMember = signal(false);
  readonly errorMessage = signal<string | null>(null);

  // Watch user input to populate form
  private formEffect = effect(() => {
    const u = this.user();
    if (u && this.isOpen()) {
      // User fields
      this.username.set(u.username);
      this.password.set(''); // Clear password field on open
      this.email.set(u.email);
      this.fullName.set(u.fullName);
      this.isActive.set(u.isActive);
      this.roleId.set(u.roleId);
      this.errorMessage.set(null);

      // Member fields
      if (u.member) {
        this.isMember.set(true);
        this.identityNumber.set(u.member.identityNumber || '');
        this.phone.set(u.member.phone || '');
        this.address.set(u.member.address || '');
        this.cardStatus.set(u.member.cardStatus);
      } else {
        this.isMember.set(false);
        this.identityNumber.set('');
        this.phone.set('');
        this.address.set('');
        this.cardStatus.set(CardStatus.PENDING);
      }
    }
  });

  setUsername(value: string): void {
    this.username.set(value);
    this.clearError();
  }

  setPassword(value: string): void {
    this.password.set(value);
    this.clearError();
  }

  setEmail(value: string): void {
    this.email.set(value);
    this.clearError();
  }

  setFullName(value: string): void {
    this.fullName.set(value);
    this.clearError();
  }

  setIdentityNumber(value: string): void {
    this.identityNumber.set(value);
    this.clearError();
  }

  setPhone(value: string): void {
    this.phone.set(value);
  }

  setAddress(value: string): void {
    this.address.set(value);
  }

  setCardStatus(value: string): void {
    this.cardStatus.set(value as CardStatus);
  }

  setIsActive(value: boolean): void {
    this.isActive.set(value);
  }

  clearError(): void {
    this.errorMessage.set(null);
  }

  close(): void {
    if (this.isSubmitting()) return;
    this.closed.emit();
  }

  submit(event: Event): void {
    event.preventDefault();
    const u = this.user();
    if (!u || this.isSubmitting()) return;

    // Validation
    if (!this.username().trim()) {
      this.errorMessage.set('Tên đăng nhập không được để trống');
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
    if (this.password().length > 0 && this.password().length < 6) {
      this.errorMessage.set('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    if (u.member) {
      // Update member with user info
      const memberRequest: MemberUpdateRequest = {
        identityNumber: this.identityNumber(),
        phone: this.phone() || undefined,
        address: this.address() || undefined,
        cardStatus: this.cardStatus(),
        username: this.username(),
        email: this.email(),
        fullName: this.fullName(),
        roleId: this.roleId(),
        isActive: this.isActive(),
      };
      this.memberService.updateMember(u.member.id, memberRequest).subscribe({
        next: (res) => {
          if (res.code === 200) {
            // Reload the current page to get updated user data
            this.userService.getUsers({}, 0, 100).subscribe({
              next: (response) => {
                const updatedUser = response.data.data.find(x => x.id === u.id);
                if (updatedUser) {
                  this.updated.emit(updatedUser);
                } else {
                  this.closed.emit();
                }
                this.isSubmitting.set(false);
              },
              error: () => {
                this.closed.emit();
                this.isSubmitting.set(false);
              }
            });
          } else {
            this.isSubmitting.set(false);
          }
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(err.error?.message || 'Có lỗi xảy ra khi cập nhật');
        }
      });
    } else {
      // User without member - update user info via user service
      const userRequest: UserRequest = {
        username: this.username().trim(),
        fullName: this.fullName().trim(),
        email: this.email().trim(),
        roleId: this.roleId(),
        isActive: this.isActive(),
      };

      // Only include password if provided
      if (this.password().length > 0) {
        userRequest.password = this.password();
      }

      this.userService.updateUser(u.id, userRequest).subscribe({
        next: (res) => {
          if (res.code === 200) {
            this.updated.emit(res.data);
            this.isSubmitting.set(false);
          } else {
            this.isSubmitting.set(false);
          }
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(err.error?.message || 'Có lỗi xảy ra khi cập nhật');
        }
      });
    }
  }
}
