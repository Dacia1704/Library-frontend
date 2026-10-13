import { Component, inject, input, output, signal, computed, effect } from '@angular/core';
import { BookService } from '@services/book.service';
import { Book } from '@model/book/book.model';
import { ImageUtils } from '@shared/utils/image-utils';

@Component({
  selector: 'app-view-book-modal',
  standalone: true,
  imports: [],
  templateUrl: './view-book-modal.html',
  styleUrls: ['./view-book-modal.scss'],
})
export class ViewBookModalComponent {
  private bookService = inject(BookService);

  isOpen = input<boolean>(false);
  bookId = input<number | null>(null);
  readonly closed = output<void>();

  readonly book = signal<Book | null>(null);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  readonly bookCover = computed(() => {
    const b = this.book();
    if (!b) return 'assets/images/book-placeholder.png';
    return ImageUtils.toImageSrc(b.cover, 'assets/images/book-placeholder.png');
  });

  readonly categoriesText = computed(() => {
    const b = this.book();
    if (!b || !b.categories?.length) return 'Không có';
    return b.categories.map(c => c.name).join(', ');
  });

  readonly authorsText = computed(() => {
    const b = this.book();
    if (!b || !b.authors?.length) return 'Không có';
    return b.authors.map(a => a.name).join(', ');
  });

  readonly publishersText = computed(() => {
    const b = this.book();
    if (!b || !b.publishers?.length) return 'Không có';
    return b.publishers.map(p => p.name).join(', ');
  });

  readonly shelfText = computed(() => {
    const b = this.book();
    if (!b?.shelf) return 'Chưa xếp kệ';
    return `${b.shelf.code} - ${b.shelf.name} (${b.shelf.location})`;
  });

  readonly formattedPrice = computed(() => {
    const b = this.book();
    if (!b?.price) return 'Không có thông tin';
    const price = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
    if (isNaN(price)) return 'Không có thông tin';
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  });

  readonly languageText = computed(() => {
    const b = this.book();
    if (!b?.language) return 'Không xác định';
    const langMap: Record<string, string> = {
      'VI': 'Tiếng Việt',
      'EN': 'Tiếng Anh',
      'RU': 'Tiếng Nga',
      'JA': 'Tiếng Nhật',
      'KO': 'Tiếng Hàn',
      'ZH': 'Tiếng Trung'
    };
    return langMap[b.language] || b.language;
  });

  readonly isOutOfStock = computed(() => {
    const b = this.book();
    return b ? b.available === 0 : false;
  });

  // Load book data when modal opens
  private loadEffect = effect(() => {
    if (this.isOpen() && this.bookId()) {
      this.loadBook();
    }
  });

  loadBook(): void {
    const id = this.bookId();
    if (!id) {
      this.errorMessage.set('Không có thông tin sách');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.bookService.getById(id.toString()).subscribe({
      next: (res) => {
        if (res.code === 200) {
          this.book.set(res.data);
        } else {
          this.errorMessage.set(res.message || 'Không thể tải thông tin sách');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Có lỗi xảy ra khi tải thông tin sách');
        this.isLoading.set(false);
      }
    });
  }

  close(): void {
    this.closed.emit();
  }
}
