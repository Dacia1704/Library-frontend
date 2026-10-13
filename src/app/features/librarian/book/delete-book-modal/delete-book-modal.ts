import { Component, inject, input, output, signal } from '@angular/core';
import { BookService } from '@services/book.service';
import { Book } from '@model/book/book.model';
import { ImageUtils } from '@shared/utils/image-utils';

@Component({
  selector: 'app-delete-book-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-book-modal.html',
  styleUrls: ['./delete-book-modal.scss'],
})
export class DeleteBookModalComponent {
  private bookService = inject(BookService);

  isOpen = input<boolean>(false);
  book = input<Book | null>(null);
  readonly closed = output<void>();
  readonly deleted = output<number>();

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  close(): void {
    if (this.isSubmitting()) return;
    this.closed.emit();
  }

  confirmDelete(): void {
    const b = this.book();
    if (!b) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.bookService.deleteBook(b.id.toString()).subscribe({
      next: (res) => {
        if (res.code === 200 || res.code === 204) {
          this.deleted.emit(b.id);
          // Close modal immediately after successful delete
          setTimeout(() => this.close(), 0);
        } else {
          this.errorMessage.set(res.message || 'Có lỗi xảy ra');
        }
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Có lỗi xảy ra khi xóa sách');
        this.isSubmitting.set(false);
      }
    });
  }

  getCoverImage(book: Book): string {
    return ImageUtils.toImageSrc(book.cover, 'assets/images/book-placeholder.png');
  }
}
