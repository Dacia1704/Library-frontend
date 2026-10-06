import { Routes } from '@angular/router';

export const READER_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'books' },
  {
    path: 'books',
    data: { title: 'Tra cứu sách' },
    loadComponent: () => import('./books/books').then(m => m.Books),
  },
  {
    path: 'books/:id',
    data: { title: 'Chi tiết sách' },
    loadComponent: () => import('./book-detail/book-detail').then(m => m.BookDetail),
  },
  {
    path: 'me',
    data: { title: 'Thông tin cá nhân' },
    loadComponent: () => import('./user-profile/user-profile').then(m => m.UserProfile)
  }
];