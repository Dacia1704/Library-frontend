import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SettingService } from '@services/setting.service';

@Component({
  selector: 'app-profile-rules',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './profile-rules.html',
  styleUrls: ['./profile-rules.scss']
})
export class ProfileRules {
  get maxBorrowDays(): number {
    return SettingService.getMaxBorrowDays();
  }
}
