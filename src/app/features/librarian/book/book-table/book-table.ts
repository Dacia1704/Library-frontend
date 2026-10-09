import { Component, input, output, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Book } from '@model/book/book.model';
import { ImageUtils } from '@shared/utils/image-utils';

@Component({
  selector: 'app-book-table',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './book-table.html',
  styleUrls: ['./book-table.scss'],
})
export class BookTableComponent {
  readonly books = input<Book[]>([]);
  readonly totalElements = input<number>(0);
  readonly currentPage = input<number>(0);
  readonly pageSize = input<number>(25);
  readonly isLoading = input<boolean>(false);

  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();
  readonly viewBook = output<number>();
  readonly editBook = output<number>();
  readonly deleteBook = output<number>();
  readonly selectionChange = output<number[]>();

  readonly selectedIds = signal<Set<number>>(new Set());
  readonly isAllSelected = signal(false);

  readonly displayStart = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    return page * size + 1;
  });

  readonly displayEnd = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    const total = this.totalElements();
    return Math.min((page + 1) * size, total);
  });

  readonly totalPages = computed(() => {
    return Math.ceil(this.totalElements() / this.pageSize()) || 1;
  });

  readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 0; i < total; i++) pages.push(i);
    } else {
      pages.push(0);
      if (current > 2) pages.push('...');
      for (let i = Math.max(1, current - 1); i <= Math.min(total - 2, current + 1); i++) {
        pages.push(i);
      }
      if (current < total - 3) pages.push('...');
      pages.push(total - 1);
    }
    return pages;
  });

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.selectedIds.set(new Set());
    } else {
      this.selectedIds.set(new Set(this.books().map((b) => b.id)));
    }
    this.isAllSelected.update((v) => !v);
    this.selectionChange.emit(Array.from(this.selectedIds()));
  }

  toggleSelectOne(id: number): void {
    const current = new Set(this.selectedIds());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.selectedIds.set(current);
    this.isAllSelected.set(current.size === this.books().length && this.books().length > 0);
    this.selectionChange.emit(Array.from(current));
  }

  formatPrice(price: string | number | undefined | null): string {
    if (price == null) return 'N/A';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return 'N/A';
    return new Intl.NumberFormat('vi-VN').format(numPrice) + ' đ';
  }

  getBookTitle(book: Book): string {
    return book.title;
  }

  getBookCover(book: Book): string {
    return ImageUtils.toImageSrc(book.cover, 'assets/images/book-placeholder.png');
  }

  getBookIsbn(book: Book): string {
    return book.isbn || 'N/A';
  }

  getBookAuthor(book: Book): string {
    return book.authors?.map(a => a.name).join(', ') || 'N/A';
  }

  getBookCategory(book: Book): string {
    return book.categories?.map(c => c.name).join(', ') || 'N/A';
  }

  getBookPublisher(book: Book): string {
    return book.publishers?.map(p => p.name).join(', ') || 'N/A';
  }

  getBookPublishYear(book: Book): number {
    return book.publishYear ?? 0;
  }

  getBookShelfCode(book: Book): string {
    return book.shelf?.code || 'N/A';
  }

  isBookOutOfStock(book: Book): boolean {
    return book.available === 0;
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSizeChange.emit(Number(select.value));
  }

  onView(id: number): void {
    this.viewBook.emit(id);
  }

  onEdit(id: number): void {
    this.editBook.emit(id);
  }

  onDelete(id: number): void {
    this.deleteBook.emit(id);
  }

  onPageClick(page: number | string): void {
    if (typeof page === 'number') {
      this.pageChange.emit(page);
    }
  }

  getPageDisplayNumber(page: number | string): number {
    return (page as number) + 1;
  }
}
