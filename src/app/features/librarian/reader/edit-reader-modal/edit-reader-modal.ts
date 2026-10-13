import { Component, inject, input, output, signal, effect } from '@angular/core';
import { Member } from '@model/member/member.model';
import { MemberService } from '@services/member.service';
import { MemberUpdateRequest } from '@model/member/request/member-update-request';
import { CardStatus } from '@model/enum/card-status.enum';

@Component({
  selector: 'app-edit-reader-modal',
  standalone: true,
  imports: [],
  templateUrl: './edit-reader-modal.html',
  styleUrls: ['./edit-reader-modal.scss'],
})
export class EditReaderModalComponent {
  private memberService = inject(MemberService);

  isOpen = input<boolean>(false);
  member = input<Member | null>(null);
  readonly closed = output<void>();
  readonly updated = output<Member>();

  readonly fullName = signal('');
  readonly email = signal('');
  readonly username = signal('');
  readonly password = signal('');
  readonly identityNumber = signal('');
  readonly phone = signal('');
  readonly address = signal('');
  readonly cardStatus = signal<CardStatus>(CardStatus.PENDING);
  readonly cardExpiry = signal('');
  readonly isActive = signal(true);
  readonly isSubmitting = signal(false);

  // Watch member input to populate form
  private formEffect = effect(() => {
    const m = this.member();
    if (m && this.isOpen()) {
      this.fullName.set(m.user.fullName);
      this.email.set(m.user.email);
      this.username.set(m.user.username);
      this.identityNumber.set(m.identityNumber);
      this.phone.set(m.phone || '');
      this.address.set(m.address || '');
      this.cardStatus.set(m.cardStatus);
      this.cardExpiry.set(this.formatDateForInput(m.cardExpiry));
      this.isActive.set(m.user.isActive);
    }
  });

  setFullName(value: string): void {
    this.fullName.set(value);
  }

  setEmail(value: string): void {
    this.email.set(value);
  }

  setUsername(value: string): void {
    this.username.set(value);
  }

  setPassword(value: string): void {
    this.password.set(value);
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

  setCardExpiry(value: string): void {
    this.cardExpiry.set(value);
  }

  setIsActive(value: string): void {
    this.isActive.set(value === 'true');
  }

  close(): void {
    if (this.isSubmitting()) return;
    this.closed.emit();
  }

  submit(event: Event): void {
    event.preventDefault();
    const m = this.member();
    if (!m || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const request: MemberUpdateRequest = {
      identityNumber: this.identityNumber(),
      phone: this.phone() || undefined,
      cardStatus: this.cardStatus(),
      address: this.address() || undefined,
      username: this.username() || undefined,
      fullName: this.fullName(),
      email: this.email(),
      password: this.password() || undefined,
      isActive: this.isActive(),
    };

    this.memberService.updateMember(m.id, request).subscribe({
      next: (res) => {
        if (res.code === 200) {
          this.updated.emit(res.data);
        }
        this.isSubmitting.set(false);
      },
      error: () => {
        this.isSubmitting.set(false);
      }
    });
  }

  private formatDateForInput(date: Date | string): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
  }
}
