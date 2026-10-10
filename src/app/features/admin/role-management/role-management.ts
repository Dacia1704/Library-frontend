import { Component } from '@angular/core';
import { RoleManagementHeaderComponent } from './role-management-header/role-management-header';
import { RoleTableComponent } from './role-table/role-table';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [
    RoleManagementHeaderComponent,
    RoleTableComponent,
  ],
  templateUrl: './role-management.html',
  styleUrls: ['./role-management.scss'],
})
export class RoleManagement {}
