import { Injectable, inject } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private readonly snackBar = inject(MatSnackBar);

  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'bottom',
    panelClass: ['app-toast']
  };

  success(message: string): void {
    this.open(message, 'success');
  }

  error(message: string): void {
    this.open(message, 'error', 5000);
  }

  warning(message: string): void {
    this.open(message, 'warning', 4000);
  }

  info(message: string): void {
    this.open(message, 'info');
  }

  private open(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info',
    duration?: number
  ): void {
    this.snackBar.open(message, 'Đóng', {
      ...this.defaultConfig,
      duration: duration ?? this.defaultConfig.duration,
      panelClass: [
        'app-toast',
        `app-toast-${type}`
      ]
    });
  }

  dismiss(): void {
    this.snackBar.dismiss();
  }
}