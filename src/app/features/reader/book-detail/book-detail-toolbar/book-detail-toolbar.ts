import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-book-detail-toolbar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="toolbar-container">

      <nav class="breadcrumb">

        <button
          type="button"
          class="breadcrumb-link home-link"
          (click)="goToBooks()"
          aria-label="Trang tra cứu sách">

          <mat-icon>home</mat-icon>

        </button>

        <span class="separator">/</span>

        <button
          type="button"
          class="breadcrumb-link"
          (click)="goToBooks()">

          Tra cứu sách

        </button>

        <span class="separator">/</span>

        <span class="current">
          Chi tiết ấn phẩm: {{ title }}
        </span>

      </nav>

      <div class="actions">

        <button
          mat-stroked-button
          (click)="goBack()">

          <mat-icon>arrow_back</mat-icon>
          Quay lại

        </button>

        <button
          mat-stroked-button
          color="accent"
          (click)="share()">

          <mat-icon>share</mat-icon>
          Chia sẻ

        </button>

      </div>

    </div>
  `,

  styles: [`
    .toolbar-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #444653;
    }

    .breadcrumb mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .breadcrumb-link {
      border: none;
      background: none;
      padding: 0;
      font: inherit;
      color: #444653;
      cursor: pointer;
    }

    .breadcrumb-link:hover {
      color: #00288e;
      text-decoration: underline;
    }

    .home-link {
      display: flex;
      align-items: center;
    }

    .home-link:hover {
      text-decoration: none;
    }

    .breadcrumb .current {
      font-weight: 600;
      color: #0b1c30;
    }

    .separator {
      color: #c4c5d5;
    }

    .actions {
      display: flex;
      gap: 12px;
    }
  `]
})
export class BookDetailToolbar {

  @Input()
  title = '';

  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  goToBooks(): void {
    this.router.navigate(['/reader/books']);
  }

  goBack(): void {
    history.back();
  }

  share(): void {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        this.toast.success('Đã copy link!');
      })
      .catch(() => {
        this.toast.error('Không thể copy link');
      });
  }
}