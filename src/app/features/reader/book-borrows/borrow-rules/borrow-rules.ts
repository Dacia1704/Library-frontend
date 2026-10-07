import { Component } from '@angular/core';
import { SettingService } from '@services/setting.service';
import { TextUtils } from '@shared/utils/text-utils';

@Component({
  selector: 'app-borrow-rules',
  standalone: true,
  templateUrl: './borrow-rules.html',
  styleUrls: ['./borrow-rules.scss'],
})
export class BorrowRules {
  get fineOverduePerDay(): string {
    return TextUtils.toVnd(SettingService.getFineOverduePerDay());
  }
  get maxBorrowDays(): number {
    return SettingService.getMaxBorrowDays();
  }
  get maxFineBeforeBlock(): string {
    return TextUtils.toVnd(SettingService.getMaxFineBeforeBlock());
  }
}