import { Component, inject, input, output, signal } from '@angular/core';
import { Book } from '@model/book/book.model';
import { BookRequest } from '@model/book/request/book-request';
import { BookMapper } from '@model/book/book.mapper';
import { BookService } from '@services/book.service';
import { ImageUtils } from '@shared/utils/image-utils';
import { HttpErrorResponse } from '@angular/common/http';
import { BookResponse } from '@model/book/response/book-response';
import { ApiResponse } from '@model/api-response';

@Component({
  selector: 'app-book-existed-modal',
  standalone: true,
  imports: [],
  templateUrl: './book-existed-modal.html',
  styleUrls: ['./book-existed-modal.scss'],
})
export class BookExistedModalComponent {
  private readonly bookService = inject(BookService);
  readonly ImageUtils = ImageUtils;

  isOpen = input<boolean>(false);
  isbn = input<string>('');
  deletedBook = input<Book | null>(null);
  isLoading = input<boolean>(false);
  newFormData = input<BookRequest | null>(null);

  readonly closed = output<void>();
  readonly cancel = output<void>();
  readonly viewOldRecord = output<string>();
  readonly restored = output<{ book: Book; isRestored: boolean }>();
  readonly restoreError = output<string>();

  readonly isRestoring = signal(false);

  onCancel(): void {
    this.cancel.emit();
  }

  onViewOldRecord(): void {
    this.viewOldRecord.emit(this.isbn());
  }

  onRestore(): void {
    const book = this.deletedBook();
    if (!book) return;

    this.isRestoring.set(true);

    const request = BookMapper.toRequest(book);

    this.bookService.restoreBook(book.id.toString(), request).subscribe({
      next: (response: ApiResponse<BookResponse>) => {
        this.isRestoring.set(false);
        const restoredBook = response.data ? BookMapper.toModel(response.data) : book;
        this.restored.emit({ book: restoredBook, isRestored: true });
      },
      error: (err: HttpErrorResponse) => {
        this.isRestoring.set(false);
        this.restoreError.emit(err.error?.message || 'Không thể khôi phục sách');
      }
    });
  }

  onOverwrite(): void {
    const newData = this.newFormData();
    const book = this.deletedBook();
    if (!newData || !book) return;

    this.isRestoring.set(true);

    this.bookService.restoreBook(book.id.toString(), newData).subscribe({
      next: (response: ApiResponse<BookResponse>) => {
        this.isRestoring.set(false);
        const restoredBook = response.data ? BookMapper.toModel(response.data) : book;
        this.restored.emit({ book: restoredBook, isRestored: true });
      },
      error: (err: HttpErrorResponse) => {
        this.isRestoring.set(false);
        this.restoreError.emit(err.error?.message || 'Không thể cập nhật sách');
      }
    });
  }
}
