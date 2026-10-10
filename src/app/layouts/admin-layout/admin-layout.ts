import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AuthService } from '@services/auth.service';
import { NavItem, Sidebar } from '@shared/components/sidebar/sidebar';
import { Topbar } from '@shared/components/topbar/topbar';

@Component({
  selector: 'app-admin-layout',
  imports: [
    RouterOutlet,
    Sidebar,
    Topbar,
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  goToProfile(): void {
    this.router.navigate(['/admin/profile']);
  }

  readonly menu: NavItem[] = [
    {
      icon: 'manage_accounts',
      label: 'Quản lý người dùng',
      route: '/admin/users',
    },
    {
      icon: 'admin_panel_settings',
      label: 'Phân quyền & Vai trò',
      route: '/admin/roles',
    },
    {
      icon: 'settings',
      label: 'Cấu hình hệ thống',
      route: '/admin/settings',
    },
    {
      icon: 'swap_horiz',
      label: 'Quản lý phiếu mượn',
      route: '/admin/borrow-records',
    },
    {
      icon: 'receipt_long',
      label: 'Quản lý tiền phạt',
      route: '/admin/fines',
    },
  ];

  logout(): void {
    this.auth.logout();
  }
}
