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
  {
    path: 'borrow-records/create',
    data: { title: 'Lập phiếu mượn mới' },
    loadComponent: () =>
      import('./borrow-create/borrow-create').then(m => m.BorrowCreatePage),
  },
  {
    path: 'return-book',
    data: { title: 'Nhận trả sách & Ghi nhận phạt' },
    loadComponent: () =>
      import('./return-book/return-book').then(m => m.ReturnBookPage),
  },
  {
    path: 'fines/receive',
    data: { title: 'Thu tiền phạt độc giả' },
    loadComponent: () =>
      import('./receive-fine/receive-fine').then(m => m.ReceiveFinePage),
  },
  {
    path: 'books',
    data: { title: 'Kho sách' },
    loadComponent: () =>
      import('./book/book').then(m => m.BookPage),
  },
  {
    path: 'catalog',
    data: { title: 'Danh mục sách & Siêu dữ liệu' },
    loadComponent: () =>
      import('./category-author-publisher/category-author-publisher').then(m => m.CategoryAuthorPublisherPage),
  },
];