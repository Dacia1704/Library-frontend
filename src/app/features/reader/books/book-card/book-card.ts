import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '@model/book/book.model';
import { ImageUtils } from '@shared/utils/image-utils';

@Component({
  selector: 'app-book-card',
  imports: [],
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss',
})
export class BookCard {
  @Input({ required: true }) book!: Book;

  private router = inject(Router);

  get isAvailable() {
    return this.book.available > 0;
  }

  /**
   * Chuẩn hoá src cho thẻ <img>:
   * - URL / data URI đầy đủ → dùng luôn
   * - Base64 thuần → tự ghép data URI
   * - Rỗng → chuỗi rỗng
   */
  get coverSrc(): string {
    return ImageUtils.toImageSrc(this.book?.cover);
  }

  onCardClick(): void {
    this.router.navigate(['reader/books', this.book.id]);
  }
}