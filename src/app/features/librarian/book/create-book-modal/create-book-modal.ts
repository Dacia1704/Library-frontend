import { Component, inject, input, output, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookService } from '@services/book.service';
import { BookRequest } from '@model/book/request/book-request';
import { Book } from '@model/book/book.model';
import { Category } from '@model/category/category.model';
import { Author } from '@model/author/author.model';
import { Publisher } from '@model/publisher/publisher.model';
import { Shelf } from '@model/shelf/shelf.model';
import { Language } from '@model/enum/language.enum';
import { BookExistedModalComponent } from '../book-existed-modal/book-existed-modal';

@Component({
  selector: 'app-create-book-modal',
  standalone: true,
  imports: [FormsModule, BookExistedModalComponent],
  templateUrl: './create-book-modal.html',
  styleUrls: ['./create-book-modal.scss'],
})
export class CreateBookModalComponent {
  private bookService = inject(BookService);

  isOpen = input<boolean>(false);
  categories = input<Category[]>([]);
  authors = input<Author[]>([]);
  publishers = input<Publisher[]>([]);
  shelves = input<Shelf[]>([]);
  readonly closed = output<void>();
  readonly created = output<void>();

  // Form signals
  readonly title = signal('');
  readonly isbn = signal('');
  readonly quantity = signal<number>(1);
  readonly available = signal<number>(1);
  readonly publishYear = signal<number | undefined>(undefined);
  readonly price = signal<number | undefined>(undefined);
  readonly coverFile = signal<File | null>(null);
  readonly coverPreview = signal<string | null>(null);
  readonly selectedCategoryIds = signal<number[]>([]);
  readonly selectedAuthorIds = signal<number[]>([]);
  readonly selectedPublisherIds = signal<number[]>([]);
  readonly language = signal<Language>(Language.VI);
  readonly pages = signal<number | undefined>(undefined);
  readonly width = signal<number | undefined>(undefined);
  readonly height = signal<number | undefined>(undefined);
  readonly synopsis = signal('');
  readonly shelfId = signal<number | undefined>(undefined);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  // Signals for handling BOOK_EXISTED conflict
  readonly showBookExistedModal = signal(false);
  readonly existedIsbn = signal('');
  readonly deletedBook = signal<Book | null>(null);
  readonly isLoadingDeletedBook = signal(false);

  // Store current form data when showing existed modal
  private pendingFormData: BookRequest | null = null;

  readonly languageOptions = Object.values(Language);

  // Watch cover file input
  onCoverChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.coverFile.set(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.coverPreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  removeCover(): void {
    this.coverFile.set(null);
    this.coverPreview.set(null);
  }

  toggleCategory(categoryId: number): void {
    const current = this.selectedCategoryIds();
    if (current.includes(categoryId)) {
      this.selectedCategoryIds.set(current.filter(id => id !== categoryId));
    } else {
      this.selectedCategoryIds.set([...current, categoryId]);
    }
  }

  toggleAuthor(authorId: number): void {
    const current = this.selectedAuthorIds();
    if (current.includes(authorId)) {
      this.selectedAuthorIds.set(current.filter(id => id !== authorId));
    } else {
      this.selectedAuthorIds.set([...current, authorId]);
    }
  }

  togglePublisher(publisherId: number): void {
    const current = this.selectedPublisherIds();
    if (current.includes(publisherId)) {
      this.selectedPublisherIds.set(current.filter(id => id !== publisherId));
    } else {
      this.selectedPublisherIds.set([...current, publisherId]);
    }
  }

  isCategorySelected(categoryId: number): boolean {
    return this.selectedCategoryIds().includes(categoryId);
  }

  isAuthorSelected(authorId: number): boolean {
    return this.selectedAuthorIds().includes(authorId);
  }

  isPublisherSelected(publisherId: number): boolean {
    return this.selectedPublisherIds().includes(publisherId);
  }

  // ===== Input Handlers =====
  onPriceInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);
    this.price.set(isNaN(value) ? undefined : value);
  }

  onPagesInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    this.pages.set(isNaN(value) ? undefined : value);
  }

  onWidthInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);
    this.width.set(isNaN(value) ? undefined : value);
  }

  onHeightInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);
    this.height.set(isNaN(value) ? undefined : value);
  }

  onShelfIdChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = parseInt(select.value, 10);
    this.shelfId.set(isNaN(value) ? undefined : value);
  }

  close(): void {
    if (this.isSubmitting()) return;
    this.resetForm();
    this.closed.emit();
  }

  // ===== Book Existed Modal Handlers =====
  getCurrentFormData(): BookRequest {
    return {
      title: this.title(),
      isbn: this.isbn(),
      quantity: this.quantity(),
      available: this.available(),
      publishYear: this.publishYear() || undefined,
      price: this.price() || undefined,
      cover: this.coverFile() || undefined,
      categoryIds: this.selectedCategoryIds().length > 0 ? this.selectedCategoryIds() : undefined,
      authorIds: this.selectedAuthorIds().length > 0 ? this.selectedAuthorIds() : undefined,
      publisherIds: this.selectedPublisherIds().length > 0 ? this.selectedPublisherIds() : undefined,
      pages: this.pages() || undefined,
      synopsis: this.synopsis() || undefined,
      language: this.language(),
      shelfId: this.shelfId(),
      width: this.width() || undefined,
      height: this.height() || undefined,
    };
  }

  onBookRestored(result: { book: Book; isRestored: boolean }): void {
    // Close existed modal
    this.deletedBook.set(null);
    this.showBookExistedModal.set(false);
    
    // Emit created event to refresh the list
    this.created.emit();
    
    // Close create modal
    this.resetForm();
    this.closed.emit();
  }

  onRestoreError(error: string): void {
    this.errorMessage.set(error);
  }

  onViewDeletedBook(isbn: string): void {
    this.isLoadingDeletedBook.set(true);
    this.bookService.getBookDeletedByIsbn(isbn).subscribe({
      next: (res) => {
        if (res.code === 200) {
          this.deletedBook.set(res.data);
        } else {
          this.errorMessage.set(res.message || 'Không thể tải thông tin sách');
        }
        this.isLoadingDeletedBook.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Có lỗi xảy ra khi tải thông tin sách');
        this.isLoadingDeletedBook.set(false);
      }
    });
  }

  onCancelBookExisted(): void {
    this.deletedBook.set(null);
    this.showBookExistedModal.set(false);
    this.existedIsbn.set('');
  }

  private resetForm(): void {
    this.title.set('');
    this.isbn.set('');
    this.quantity.set(1);
    this.available.set(1);
    this.publishYear.set(undefined);
    this.price.set(undefined);
    this.coverFile.set(null);
    this.coverPreview.set(null);
    this.selectedCategoryIds.set([]);
    this.selectedAuthorIds.set([]);
    this.selectedPublisherIds.set([]);
    this.language.set(Language.VI);
    this.pages.set(undefined);
    this.width.set(undefined);
    this.height.set(undefined);
    this.synopsis.set('');
    this.shelfId.set(undefined);
    this.errorMessage.set('');
  }

  submit(event: Event): void {
    event.preventDefault();

    if (!this.title() || !this.isbn()) {
      this.errorMessage.set('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (this.available() > this.quantity()) {
      this.errorMessage.set('Số lượng khả dụng không thể lớn hơn tổng số lượng');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const request: BookRequest = {
      title: this.title(),
      isbn: this.isbn(),
      quantity: this.quantity(),
      available: this.available(),
      publishYear: this.publishYear() || undefined,
      price: this.price() || undefined,
      cover: this.coverFile() || undefined,
      categoryIds: this.selectedCategoryIds().length > 0 ? this.selectedCategoryIds() : undefined,
      authorIds: this.selectedAuthorIds().length > 0 ? this.selectedAuthorIds() : undefined,
      publisherIds: this.selectedPublisherIds().length > 0 ? this.selectedPublisherIds() : undefined,
      pages: this.pages() || undefined,
      synopsis: this.synopsis() || undefined,
      language: this.language(),
      shelfId: this.shelfId(),
      width: this.width() || undefined,
      height: this.height() || undefined,
    };

    this.bookService.create(request).subscribe({
      next: (res) => {
        if (res.code === 200) {
          this.resetForm();
          this.created.emit();
          this.isSubmitting.set(false);
          this.close();
        } else {
          this.errorMessage.set(res.message || 'Có lỗi xảy ra');
          this.isSubmitting.set(false);
        }
      },
      error: (err) => {
        if (err.status === 409) {
          // BOOK_EXISTED - show book-existed modal
          this.existedIsbn.set(this.isbn());
          this.showBookExistedModal.set(true);
        } else {
          this.errorMessage.set(err.error?.message || 'Có lỗi xảy ra khi tạo sách');
        }
        this.isSubmitting.set(false);
      }
    });
  }
}
