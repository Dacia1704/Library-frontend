import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AuthService } from '@services/auth.service';
import { NavItem, Sidebar } from '@shared/components/sidebar/sidebar';
import { Topbar } from '@shared/components/topbar/topbar';

@Component({
  selector: 'app-reader-layout',
  imports: [
    RouterOutlet,
    Sidebar,
    Topbar,
  ],
  templateUrl: './reader-layout.html',
  styleUrl: './reader-layout.scss',
})
export class ReaderLayout {

  private readonly auth = inject(AuthService);

  private readonly router = inject(Router);

  goToProfile(): void {
    this.router.navigate(['/reader/me']);
  }

  goToMemberCard(): void {
    this.router.navigate(['/reader/me/card']);
  }

  readonly menu: NavItem[] = [
    {
      icon: 'search',
      label: 'Tra cứu sách',
      route: '/reader',
    },
    {
      icon: 'swap_horizontal_circle',
      label: 'Quản lý mượn / trả',
      route: '/reader/borrows',
    },
    {
      icon: 'receipt_long',
      label: 'Quản lý phí phạt',
      route: '/reader/fines',
    },
  ];

  logout(): void {
    this.auth.logout();
  }
}