import { Component, inject, input, output, signal } from '@angular/core';
import { MemberService } from '@services/member.service';
import { CreateUserMemberRequest } from '@model/member/request/create-user-member-request';
import { SettingService } from '@services/setting.service';
import { TextUtils } from '@shared/utils/text-utils';

@Component({
  selector: 'app-register-reader-modal',
  standalone: true,
  imports: [],
  templateUrl: './register-reader-modal.html',
  styleUrls: ['./register-reader-modal.scss'],
})
export class RegisterReaderModalComponent {
  private memberService = inject(MemberService);

  isOpen = input<boolean>(false);
  readonly closed = output<void>();
  readonly created = output<string>();

  readonly username = signal('');
  readonly password = signal('');
  readonly fullName = signal('');
  readonly email = signal('');
  readonly identityNumber = signal('');
  readonly phone = signal('');
  readonly address = signal('');
  readonly monthRequest = signal(1);
  readonly showPassword = signal(false);
  readonly isSubmitting = signal(false);

  setUsername(value: string): void {
    this.username.set(value);
  }

  setPassword(value: string): void {
    this.password.set(value);
  }

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

  setMonthRequest(value: string): void {
    const num = parseInt(value, 10);
    this.monthRequest.set(isNaN(num) || num < 1 ? 1 : num);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(p => !p);
  }

  close(): void {
    if (this.isSubmitting()) return;
    this.resetForm();
    this.closed.emit();
  }

  submit(event: Event): void {
    event.preventDefault();
    if (this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const request: CreateUserMemberRequest = {
      username: this.username(),
      password: this.password(),
      fullName: this.fullName(),
      email: this.email(),
      identityNumber: this.identityNumber(),
      phone: this.phone() || undefined,
      address: this.address() || undefined,
      monthRequest: this.monthRequest(),
      amount: this.calculatedAmount,
    };

    this.memberService.registerUserAndMember(request).subscribe({
      next: (res) => {
        if (res.code === 200) {
          const name = this.fullName();
          this.resetForm();
          this.created.emit(name);
        }
        this.isSubmitting.set(false);
      },
      error: () => {
        this.isSubmitting.set(false);
      }
    });
  }

  private resetForm(): void {
    this.username.set('');
    this.password.set('');
    this.fullName.set('');
    this.email.set('');
    this.identityNumber.set('');
    this.phone.set('');
    this.address.set('');
    this.monthRequest.set(1);
    this.showPassword.set(false);
  }

  get memberPaymentMonth(): string {
    return TextUtils.toVnd(SettingService.getMemberPaymentMonth());
  }
  get cardMakerFee(): string {
    return TextUtils.toVnd(SettingService.getCardMakerFee());
  }
  get calculatedAmount(): number {
    const monthFee = SettingService.getMemberPaymentMonth();
    const makerFee = SettingService.getCardMakerFee();
    return (this.monthRequest() * monthFee) + makerFee;
  }
  get calculatedAmountText(): string {
    return TextUtils.toVnd(this.calculatedAmount);
  }

}
