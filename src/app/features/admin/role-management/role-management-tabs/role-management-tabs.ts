import { Component, input } from '@angular/core';

@Component({
  selector: 'app-role-management-tabs',
  standalone: true,
  templateUrl: './role-management-tabs.html',
  styleUrl: './role-management-tabs.scss',
})
export class RoleManagementTabsComponent {
  rolesComponent = input.required<any>();
  permissionsComponent = input.required<any>();

  activeTab: 'roles' | 'permissions' = 'roles';

  switchTab(tab: 'roles' | 'permissions'): void {
    this.activeTab = tab;
  }
}
