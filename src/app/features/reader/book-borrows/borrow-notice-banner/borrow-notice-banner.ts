import { Component } from '@angular/core';
import { SettingService } from '@services/setting.service';
import { TextUtils } from '@shared/utils/text-utils';

@Component({
  selector: 'app-borrow-notice-banner',
  standalone: true,
  templateUrl: './borrow-notice-banner.html',
  styleUrls: ['./borrow-notice-banner.scss'],
})
export class BorrowNoticeBanner {
  get fineOverduePerDay(): string {
    return TextUtils.toVnd(SettingService.getFineOverduePerDay());
  }
}