import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Book } from '@model/book/book.model';

@Component({
  selector: 'app-book-metadata',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="meta-card" appearance="outlined">
      <span class="section-title">THÔNG TIN CHI TIẾT XUẤT BẢN & TÁC QUYỀN</span>
      
      <div class="meta-grid">
        <div class="meta-item"><span class="lbl">ISBN</span><span class="val mono">{{ book.isbn }}</span></div>
        <div class="meta-item"><span class="lbl">Năm xuất bản</span><span class="val">{{ book.publishYear }}</span></div>
        <div class="meta-item"><span class="lbl">Giá bìa</span><span class="val">{{ book.price }}</span></div>
        <div class="meta-item"><span class="lbl">Mã phân loại</span><span class="val">895.9223</span></div>
        
        <!-- NXB Card -->
        <div
          class="full-width-item bg-light"
          *ngFor="let publisher of book.publishers"
        >
          <div class="item-header text-primary">
            <mat-icon>business</mat-icon>

            <strong>
              Đơn vị phát hành: {{ publisher.name }}
            </strong>
          </div>

          <div class="item-desc">
            {{ publisher.address }}
          </div>
        </div>

        <!-- Author Card -->
        <div
          class="full-width-item bg-light"
          *ngFor="let author of book.authors"
        >
          <div class="author-header">

            <div class="avatar">
              {{ author.name.charAt(0) }}
            </div>

            <div class="author-title">
              <strong>{{ author.name }}</strong>

              <span class="sub text-secondary">
                Tác giả
              </span>
            </div>

          </div>

          <p class="author-bio">
            {{ author.bio }}
          </p>
        </div>
      </div>
    </mat-card>
  `,
  styles: [`
    .meta-card { padding: 24px; border-radius: 12px; }
    .section-title { font-size: 12px; font-weight: 600; color: #444653; margin-bottom: 16px; display: block; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .meta-item { display: flex; flex-direction: column; gap: 4px; }
    .meta-item .lbl { font-size: 11px; color: #757684; }
    .meta-item .val { font-size: 14px; font-weight: 600; color: #0b1c30; }
    .mono { font-family: monospace; }
    .full-width-item { grid-column: span 2; padding: 16px; border-radius: 8px; }
    .bg-light { background: #eff4ff; }
    .text-primary { color: #00288e; }
    .text-secondary { color: #006a61; }
    .item-header { display: flex; align-items: center; gap: 8px; font-size: 14px; mat-icon { font-size: 18px; width: 18px; height: 18px; } }
    .item-desc { font-size: 13px; color: #444653; padding-left: 26px; margin-top: 4px; }
    .author-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
    .avatar { width: 40px; height: 40px; background: #dde1ff; color: #00288e; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; }
    .author-title { display: flex; flex-direction: column; strong { font-size: 14px; color: #0b1c30; } .sub { font-size: 12px; font-weight: 500; } }
    .author-bio { font-size: 13px; color: #0b1c30; line-height: 1.5; margin: 0; }
  `]
})
export class BookMetadata {
  @Input({ required: true }) book!: Book;
}