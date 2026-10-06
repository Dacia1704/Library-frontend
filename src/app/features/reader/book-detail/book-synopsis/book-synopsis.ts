import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-book-synopsis',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="synopsis-wrapper">
      <div class="title-row">
        <mat-icon color="primary">menu_book</mat-icon>
        <h2>Tóm tắt nội dung tác phẩm</h2>
      </div>
      <div class="content-box" [innerHTML]="synopsis"></div>
    </div>
  `,
  styles: [`
    .synopsis-wrapper { display: flex; flex-direction: column; gap: 12px; }
    .title-row { display: flex; align-items: center; gap: 8px; h2 { font-size: 16px; font-weight: 700; color: #0b1c30; margin: 0; } }
    .content-box { background: rgba(239, 244, 255, 0.5); padding: 24px; border-radius: 12px; font-size: 14px; line-height: 1.6; color: #0b1c30; }
    /* Style for innerHTML tags */
    ::ng-deep .content-box p { margin-top: 0; margin-bottom: 12px; }
    ::ng-deep .content-box p:last-child { margin-bottom: 0; }
  `]
})
export class BookSynopsis {
  @Input({ required: true }) synopsis!: string;
}