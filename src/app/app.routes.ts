import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'reader',
    canActivate: [roleGuard(['MEMBER'])],
    loadComponent: () => import('./layouts/reader-layout/reader-layout').then(m => m.ReaderLayout),
    children: [
      { path: '', loadChildren: () => import('./features/reader/reader.routes').then(m => m.READER_ROUTES) },
    ],
  },
];
