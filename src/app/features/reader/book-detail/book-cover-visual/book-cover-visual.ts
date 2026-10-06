import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Book } from '@model/book/book.model';

@Component({
  selector: 'app-book-cover-visual',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="visual-container">
      <div class="cover-showcase">
        <div class="ribbon"><mat-icon>local_fire_department</mat-icon> Sách nổi bật</div>
        <img [src]="book.cover" [alt]="book.title" class="cover-img"/>
      </div>
      
      <mat-card class="specs-card" appearance="outlined">
        <span class="specs-title">THÔNG SỐ VẬT LÝ ẤN PHẨM</span>
        <div class="specs-grid">
          <div class="spec-item">
            <span class="lbl">Kích thước</span><span class="val">{{ book.width }} x {{ book.height }} cm</span>
          </div>
          <div class="spec-item">
            <span class="lbl">Số trang</span><span class="val">{{ book.pages }} trang</span>
          </div>
          <div class="spec-item">
            <span class="lbl">Mã sách</span><span class="val">{{ book.bookCode }}</span>
          </div>
          <div class="spec-item">
            <span class="lbl">Ngôn ngữ</span><span class="val">{{ book.language }}</span>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .visual-container { display: flex; flex-direction: column; gap: 16px; }
    .cover-showcase { background: #eff4ff; padding: 24px; border-radius: 8px; display: flex; justify-content: center; position: relative; }
    .cover-img { width: 100%; max-width: 240px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); transition: transform 0.3s; }
    .cover-img:hover { transform: scale(1.02); }
    .ribbon { position: absolute; top: 12px; left: 12px; background: #00288e; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; display: flex; align-items: center; gap: 4px; font-weight: 600; text-transform: uppercase; mat-icon { font-size: 14px; width: 14px; height: 14px; } }
    .specs-card { padding: 16px; background: rgba(239, 244, 255, 0.7); }
    .specs-title { font-size: 12px; font-weight: 600; color: #444653; display: block; margin-bottom: 12px; }
    .specs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .spec-item { background: #fff; padding: 10px; border-radius: 6px; display: flex; flex-direction: column; }
    .spec-item .lbl { font-size: 11px; color: #757684; margin-bottom: 4px; }
    .spec-item .val { font-size: 14px; font-weight: 600; color: #0b1c30; }
  `]
})
export class BookCoverVisual {
  @Input({ required: true }) book!: Book;
}