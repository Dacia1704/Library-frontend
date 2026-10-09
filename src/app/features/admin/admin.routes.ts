import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'users',
    data: { title: 'Quản lý người dùng' },
    loadComponent: () => import('./user-management/user-management').then(m => m.UserManagement),
  },
  {
    path: 'roles',
    data: { title: 'Phân quyền & Vai trò' },
    loadComponent: () => import('./role-management/role-management').then(m => m.RoleManagement),
  },
  {
    path: 'settings',
    data: { title: 'Cấu hình hệ thống' },
    loadComponent: () => import('./setting/setting').then(m => m.AdminSetting),
  },
  {
    path: 'borrow-records',
    data: { title: 'Quản lý phiếu mượn' },
    loadComponent: () => import('./borrow-record/borrow-record').then(m => m.AdminBorrowRecord),
  },
  {
    path: 'fines',
    data: { title: 'Quản lý tiền phạt' },
    loadComponent: () => import('./fine-management/fine-management').then(m => m.FineManagement),
  },
];
