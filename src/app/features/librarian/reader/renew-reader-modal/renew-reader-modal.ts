import { Component, inject, input, output, signal, effect } from '@angular/core';
import { Member } from '@model/member/member.model';
import { MemberService } from '@services/member.service';
import { MemberRenewRequest } from '@model/member/request/member-renew-request';
import { SettingService } from '@services/setting.service';
import { TextUtils } from '@shared/utils/text-utils';

@Component({
  selector: 'app-renew-reader-modal',
  standalone: true,
  imports: [],
  templateUrl: './renew-reader-modal.html',
  styleUrls: ['./renew-reader-modal.scss'],
})
export class RenewReaderModalComponent {
  private memberService = inject(MemberService);

  isOpen = input<boolean>(false);
  member = input<Member | null>(null);
  readonly closed = output<void>();
  readonly renewed = output<Member>();

  readonly monthRequest = signal(1);
  readonly isSubmitting = signal(false);

  private resetEffect = effect(() => {
    if (this.isOpen() && this.member()) {
      this.monthRequest.set(1);
    }
  });

  setMonthRequest(value: string): void {
    const num = parseInt(value, 10);
    this.monthRequest.set(isNaN(num) || num < 1 ? 1 : num);
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

    const request: MemberRenewRequest = {
      monthRequest: this.monthRequest(),
      amount: this.calculatedAmount,
    };

    this.memberService.renewMember(m.id, request).subscribe({
      next: (res) => {
        if (res.code === 200) {
          this.renewed.emit(res.data);
        }
        this.isSubmitting.set(false);
      },
      error: () => {
        this.isSubmitting.set(false);
      },
    });
  }

  get memberPaymentMonth(): string {
    return TextUtils.toVnd(SettingService.getMemberPaymentMonth());
  }

  get calculatedAmount(): number {
    return this.monthRequest() * SettingService.getMemberPaymentMonth();
  }

  get calculatedAmountText(): string {
    return TextUtils.toVnd(this.calculatedAmount);
  }

  get cardExpiryText(): string {
    const m = this.member();
    if (!m?.cardExpiry) return '—';
    return TextUtils.formatDate(m.cardExpiry, 'dd/MM/yyyy');
  }
}
