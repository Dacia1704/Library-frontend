import { Component, Input, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { ReportService } from '@services/report.service';

export interface NavItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @Input() menu: NavItem[] = [];

  private authService = inject(AuthService);
  private reportService = inject(ReportService);

  get isAdmin(): boolean {
    return this.authService.hasAnyRole(['ADMIN']);
  }

  exportStatisticsPdf(): void {
    this.reportService.downloadPdf('Thống kê Thư viện', 'thong_ke_thu_vien.pdf');
  }
}
