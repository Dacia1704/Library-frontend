import { Component } from '@angular/core';

import { UserManagementHeaderComponent } from './user-management-header/user-management-header';
import { UserManagementToolbarComponent } from './user-management-toolbar/user-management-toolbar';
import { UserTableComponent } from './user-table/user-table';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    UserManagementHeaderComponent,
    UserManagementToolbarComponent,
    UserTableComponent,
  ],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.scss'],
})
export class UserManagement {}
