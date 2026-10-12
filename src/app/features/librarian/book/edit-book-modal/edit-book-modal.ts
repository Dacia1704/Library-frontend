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
import { BookMapper } from '@model/book/book.mapper';
import { ImageUtils } from '@shared/utils/image-utils';

@Component({
  selector: 'app-edit-book-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-book-modal.html',
  styleUrls: ['./edit-book-modal.scss'],
})
export class EditBookModalComponent {
  private bookService = inject(BookService);
  readonly ImageUtils = ImageUtils;

  isOpen = input<boolean>(false);
  bookId = input<number | null>(null);
  categories = input<Category[]>([]);
  authors = input<Author[]>([]);
  publishers = input<Publisher[]>([]);
  shelves = input<Shelf[]>([]);
  readonly closed = output<void>();
  readonly updated = output<Book>();

  // Form signals
  readonly title = signal('');
  readonly isbn = signal('');
  readonly quantity = signal<number>(1);
  readonly available = signal<number>(1);
  readonly publishYear = signal<number | undefined>(undefined);
  readonly price = signal<number | undefined>(undefined);
  readonly coverUrl = signal<string | null>(null);
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
  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  readonly languageOptions = Object.values(Language);

  // Load book data when opening
  private loadEffect = effect(() => {
    if (this.isOpen() && this.bookId()) {
      this.loadBook();
    }
  });

  private loadBook(): void {
    const id = this.bookId();
    if (!id) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.bookService.getById(id.toString()).subscribe({
      next: (res) => {
        if (res.code === 200) {
          const book = res.data;
          this.title.set(book.title);
          this.isbn.set(book.isbn || '');
          this.quantity.set(book.quantity);
          this.available.set(book.available);
          this.publishYear.set(book.publishYear || undefined);
          this.price.set(book.price ? parseFloat(book.price) : undefined);
          this.coverUrl.set(book.cover || null);
          this.language.set(book.language || Language.VI);
          this.pages.set(book.pages || undefined);
          this.width.set(book.width || undefined);
          this.height.set(book.height || undefined);
          this.synopsis.set(book.synopsis || '');
          this.shelfId.set(book.shelf?.id || undefined);
          this.selectedCategoryIds.set(book.categories?.map(c => c.id) || []);
          this.selectedAuthorIds.set(book.authors?.map(a => a.id) || []);
          this.selectedPublisherIds.set(book.publishers?.map(p => p.id) || []);
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
    this.coverUrl.set(null);
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

  close(): void {
    if (this.isSubmitting()) return;
    this.closed.emit();
  }

  submit(event: Event): void {
    event.preventDefault();

    const id = this.bookId();
    if (!id || !this.title() || !this.isbn()) {
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

    this.bookService.updateBook(id.toString(), request).subscribe({
      next: (res) => {
        if (res.code === 200) {
          const book = BookMapper.toModel(res.data);
          this.updated.emit(book);
          this.close();
        } else {
          this.errorMessage.set(res.message || 'Có lỗi xảy ra');
        }
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Có lỗi xảy ra khi cập nhật sách');
        this.isSubmitting.set(false);
      }
    });
  }

  // ===== Input Handlers =====
  onPublishYearInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    this.publishYear.set(isNaN(value) ? undefined : value);
  }

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
}
