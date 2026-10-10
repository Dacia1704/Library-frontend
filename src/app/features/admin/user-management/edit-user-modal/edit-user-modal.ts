import { Component, inject, input, output, signal, effect } from '@angular/core';
import { User } from '@model/user/user.model';
import { MemberService } from '@services/member.service';
import { UserService } from '@services/user.service';
import { MemberUpdateRequest } from '@model/member/request/member-update-request';
import { CardStatus } from '@model/enum/card-status.enum';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [],
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

  // Watch user input to populate form
  private formEffect = effect(() => {
    const u = this.user();
    if (u && this.isOpen()) {
      // User fields
      this.username.set(u.username);
      this.email.set(u.email);
      this.fullName.set(u.fullName);
      this.isActive.set(u.isActive);
      this.roleId.set(u.roleId);

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
  }

  setEmail(value: string): void {
    this.email.set(value);
  }

  setFullName(value: string): void {
    this.fullName.set(value);
  }

  setIdentityNumber(value: string): void {
    this.identityNumber.set(value);
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

  close(): void {
    if (this.isSubmitting()) return;
    this.closed.emit();
  }

  submit(event: Event): void {
    event.preventDefault();
    const u = this.user();
    if (!u || this.isSubmitting()) return;

    this.isSubmitting.set(true);

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
      console.log(u.member);
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
        error: () => {
          this.isSubmitting.set(false);
        }
      });
    } else {
      // User without member - just update user info via user service
      // This would require a separate updateUser method
      this.isSubmitting.set(false);
      this.closed.emit();
    }
  }
}
