import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AuthService } from '@services/auth.service';
import { NavItem, Sidebar } from '@shared/components/sidebar/sidebar';
import { Topbar } from '@shared/components/topbar/topbar';

@Component({
  selector: 'app-librarian-layout',
  imports: [
    RouterOutlet,
    Sidebar,
    Topbar,
  ],
  templateUrl: './librarian-layout.html',
  styleUrl: './librarian-layout.scss',
})
export class LibrarianLayout {

  private readonly auth = inject(AuthService);

  private readonly router = inject(Router);

  goToProfile(): void {
    this.router.navigate(['/librarian/profile']);
  }

  readonly menu: NavItem[] = [
    {
      icon: 'dashboard',
      label: 'Tổng quan',
      route: '/librarian/overview',
    },
    {
      icon: 'badge',
      label: 'Quản lý độc giả',
      route: '/librarian/readers',
    },
    {
      icon: 'swap_horiz',
      label: 'Quản lý mượn / trả',
      route: '/librarian/borrow-records',
    },
    {
      icon: 'receipt_long',
      label: 'Quản lý phí phạt',
      route: '/librarian/fines/receive',
    },
    {
      icon: 'manage_search',
      label: 'Tra cứu sách',
      route: '/librarian/books',
    },
    {
      icon: 'auto_stories',
      label: 'Danh mục sách',
      route: '/librarian/catalog',
    },

  ];

  logout(): void {
    this.auth.logout();
  }
}