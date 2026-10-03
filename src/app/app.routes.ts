import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';

export const routes: Routes = [
  {
    path: 'login',
  },
];
