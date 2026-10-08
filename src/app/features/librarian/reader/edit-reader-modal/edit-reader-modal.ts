import { Component, inject, input, output, signal, effect } from '@angular/core';
import { Member } from '@model/member/member.model';
import { MemberService } from '@services/member.service';
import { MemberRequest } from '@model/member/request/member-request';
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
  readonly identityNumber = signal('');
  readonly phone = signal('');
  readonly address = signal('');
  readonly cardStatus = signal<CardStatus>(CardStatus.PENDING);
  readonly cardExpiry = signal('');
  readonly isSubmitting = signal(false);

  // Watch member input to populate form
  private formEffect = effect(() => {
    const m = this.member();
    if (m && this.isOpen()) {
      this.fullName.set(m.user.fullName);
      this.email.set(m.user.email);
      this.identityNumber.set(m.identityNumber);
      this.phone.set(m.phone || '');
      this.address.set(m.address || '');
      this.cardStatus.set(m.cardStatus);
      this.cardExpiry.set(this.formatDateForInput(m.cardExpiry));
    }
  });

  setFullName(value: string): void {
    this.fullName.set(value);
  }

  setEmail(value: string): void {
    this.email.set(value);
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

  close(): void {
    if (this.isSubmitting()) return;
    this.closed.emit();
  }

  submit(event: Event): void {
    event.preventDefault();
    const m = this.member();
    if (!m || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const request: MemberRequest = {
      userId: m.user.id,
      memberCode: m.memberCode,
      identityNumber: this.identityNumber(),
      phone: this.phone() || undefined,
      address: this.address() || undefined,
      cardExpiry: this.cardExpiry() || new Date().toISOString().split('T')[0],
      cardStatus: this.cardStatus(),
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
