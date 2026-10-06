import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';

export const routes: Routes = [
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
