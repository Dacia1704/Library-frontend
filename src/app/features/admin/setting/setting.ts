import { Component } from '@angular/core';

import { SettingHeaderComponent } from './setting-header/setting-header';
import { SettingGroupsComponent } from './setting-groups/setting-groups';
import { SettingTableComponent } from './setting-table/setting-table';

@Component({
  selector: 'app-admin-setting',
  standalone: true,
  imports: [
    SettingHeaderComponent,
    SettingGroupsComponent,
    SettingTableComponent,
  ],
  templateUrl: './setting.html',
  styleUrls: ['./setting.scss'],
})
export class AdminSetting {}
