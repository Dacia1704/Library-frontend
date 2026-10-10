import { Component } from '@angular/core';

import { SettingHeaderComponent } from './setting-header/setting-header';
import { SettingTableComponent } from './setting-table/setting-table';

@Component({
  selector: 'app-admin-setting',
  standalone: true,
  imports: [
    SettingHeaderComponent,
    SettingTableComponent,
  ],
  templateUrl: './setting.html',
  styleUrls: ['./setting.scss'],
})
export class AdminSetting {}
