import { Routes } from '@angular/router';

export const LIBRARIAN_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  {
    path: 'overview',
    data: { title: 'Tổng quan nghiệp vụ thủ thư' },
    loadComponent: () => import('./overview/overview').then(m => m.LibrarianOverview),
  },
  {
    path: 'readers',
    data: { title: 'Quản lý độc giả' },
    loadComponent: () =>
      import('./reader/reader').then(m => m.Reader),
  },
  {
    path: 'borrow-records',
    data: { title: 'Quản lý phiếu mượn' },
    loadComponent: () =>
      import('./borrow-record/borrow-record').then(m => m.BorrowRecordPage),
  },
];