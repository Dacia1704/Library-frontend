import { Component } from '@angular/core';

import { RoleManagementHeaderComponent } from './role-management-header/role-management-header';
import { RoleManagementTabsComponent } from './role-management-tabs/role-management-tabs';
import { RoleTableComponent } from './role-table/role-table';
import { PermissionTableComponent } from './permission-table/permission-table';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [
    RoleManagementHeaderComponent,
    RoleManagementTabsComponent,
    RoleTableComponent,
    PermissionTableComponent,
  ],
  templateUrl: './role-management.html',
  styleUrls: ['./role-management.scss'],
})
export class RoleManagement {}
