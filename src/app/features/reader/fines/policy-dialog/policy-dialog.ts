import { Component, Output, EventEmitter } from '@angular/core';
import { SettingService } from '@services/setting.service';
import { TextUtils } from '@shared/utils/text-utils';

@Component({
  selector: 'app-policy-dialog',
  standalone: true,
  imports: [],
  templateUrl: './policy-dialog.html',
  styleUrls: ['./policy-dialog.scss'],
})
export class PolicyDialogComponent {
  @Output() onClose = new EventEmitter<void>();

  private dialogEl: HTMLDialogElement | null = null;

  show(dialogEl: HTMLDialogElement): void {
    this.dialogEl = dialogEl;
    dialogEl.showModal();
  }

  close(): void {
    if (this.dialogEl) {
      this.dialogEl.close();
    }
    this.onClose.emit();
  }

  get fineOverduePerDay(): string {
    return TextUtils.toVnd(SettingService.getFineOverduePerDay());
  }

  get fineDamagedLightRate(): string {
    return TextUtils.toPercentage(SettingService.getFineDamagedLightRate());
  }
  get fineDamagedHeavyRepairableRate(): string {
    return TextUtils.toPercentage(SettingService.getFineDamagedHeavyRepairableRate());
  }
  get fineDamagedHeavyIrreparableRate(): string {
    return TextUtils.toPercentage(SettingService.getFineDamagedHeavyIrreparableRate());
  }

  get fineLostRate(): string {
    return TextUtils.toPercentage(SettingService.getFineLostRate());
  }
}
