import { Component, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reader-layout',
  imports: [
    MatSidenavModule, MatToolbarModule, MatListModule,
    MatIconModule, MatButtonModule, MatMenuModule, MatDividerModule,
  ],
  templateUrl: './reader-layout.html',
  styleUrl: './reader-layout.scss',
})
export class ReaderLayout {
  protected auth = inject(AuthService);
  private router = inject(Router);
  private breakpoint = inject(BreakpointObserver);
 
  menu = [
  ];

  /** true khi màn hình hẹp → sidebar chuyển sang dạng trượt */
  isMobile = toSignal(
    this.breakpoint.observe('(max-width: 800px)').pipe(map(r => r.matches)),
    { initialValue: false },
  );

  /** Tiêu đề trang lấy từ data.title của route đang hiển thị */
  pageTitle = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.readTitle()),
      startWith(this.readTitle()),
    ),
    { initialValue: '' },
  );

  private readTitle(): string {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) route = route.firstChild;
    return route.data['title'] ?? '';
  }

  logout() {
    this.auth.logout();
  }
}