import { Component, inject, OnInit, signal } from '@angular/core';
import { BookBreadcrumbComponent } from './book-breadcrumb/book-breadcrumb';
import { BookHeaderComponent } from './book-header/book-header';
import { BookSearchComponent } from './book-search/book-search';
import { BookTableComponent } from './book-table/book-table';
import { BookBulkActionsComponent } from './book-bulk-actions/book-bulk-actions';
import { CreateBookModalComponent } from './create-book-modal/create-book-modal';
import { ViewBookModalComponent } from './view-book-modal/view-book-modal';
import { EditBookModalComponent } from './edit-book-modal/edit-book-modal';
import { DeleteBookModalComponent } from './delete-book-modal/delete-book-modal';

import { BookService } from '@services/book.service';
import { CategoryService } from '@services/category.service';
import { AuthorService } from '@services/author.service';
import { PublisherService } from '@services/publisher.service';
import { ShelfService } from '@services/shelf.service';

import { Book } from '@model/book/book.model';
import { BookFilter } from '@model/book/request/book-filter';
import { BookStatisticsResponse } from '@model/book/response/book-statistics-response';
import { Category } from '@model/category/category.model';
import { Author } from '@model/author/author.model';
import { Publisher } from '@model/publisher/publisher.model';
import { Shelf } from '@model/shelf/shelf.model';

@Component({
  selector: 'app-book-page',
  standalone: true,
  imports: [
    BookBreadcrumbComponent,
    BookHeaderComponent,
    BookSearchComponent,
    BookTableComponent,
    BookBulkActionsComponent,
    CreateBookModalComponent,
    ViewBookModalComponent,
    EditBookModalComponent,
    DeleteBookModalComponent,
  ],
  templateUrl: './book.html',
  styleUrls: ['./book.scss'],
})
export class BookPage implements OnInit {
  private readonly bookService = inject(BookService);
  private readonly categoryService = inject(CategoryService);
  private readonly authorService = inject(AuthorService);
  private readonly publisherService = inject(PublisherService);
  private readonly shelfService = inject(ShelfService);

  // ===== Filter State =====
  readonly filter = signal<Partial<BookFilter>>({});

  // ===== Stats from API =====
  readonly stats = signal<BookStatisticsResponse>({
    totalTitles: 0,
    totalCopies: 0,
    borrowedCopies: 0,
    outOfStockTitles: 0,
  });

  // ===== Table State =====
  readonly books = signal<Book[]>([]);
  readonly totalElements = signal(0);
  readonly currentPage = signal(0);
  readonly pageSize = signal(25);
  readonly selectedIds = signal<number[]>([]);
  readonly isLoading = signal(false);

  // ===== Dropdown Options =====
  readonly categories = signal<Category[]>([]);
  readonly authors = signal<Author[]>([]);
  readonly publishers = signal<Publisher[]>([]);
  readonly shelves = signal<Shelf[]>([]);
  readonly years = signal<number[]>([2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018]);

  // ===== Modal State =====
  readonly showCreateModal = signal(false);
  readonly showViewModal = signal(false);
  readonly showEditModal = signal(false);
  readonly showDeleteModal = signal(false);
  readonly viewingBookId = signal<number | null>(null);
  readonly editingBookId = signal<number | null>(null);
  readonly deletingBook = signal<Book | null>(null);

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.loadStatistics();
    this.loadBooks();
    this.loadCategories();
    this.loadAuthors();
    this.loadPublishers();
    this.loadShelves();
  }

  private loadStatistics(): void {
    this.bookService.getStatistics().subscribe({
      next: (response) => {
        if (response.code === 200) {
          console.log(response.data);
          this.stats.set(response.data);
        }
      }
    });
  }

  private loadBooks(): void {
    this.isLoading.set(true);
    this.bookService.getPagination(this.filter() as BookFilter, this.currentPage(), this.pageSize())
      .subscribe({
        next: (response) => {
          if (response.code === 200) {
            this.books.set(response.data.data);
            this.totalElements.set(response.data.totalElements);
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.categories.set(response.data);
        }
      }
    });
  }

  private loadAuthors(): void {
    this.authorService.getAuthors().subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.authors.set(response.data);
        }
      }
    });
  }

  private loadPublishers(): void {
    this.publisherService.getPublishers().subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.publishers.set(response.data);
        }
      }
    });
  }

  private loadShelves(): void {
    this.shelfService.getAll().subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.shelves.set(response.data);
        }
      }
    });
  }

  // ===== Filter Change =====
  onFilterChange(filter: BookFilter): void {
    this.filter.set(filter);
    this.currentPage.set(0);
    this.loadBooks();
  }

  onReset(): void {
    this.filter.set({});
    this.loadBooks();
  }

  // ===== Pagination =====
  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadBooks();
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(0);
    this.loadBooks();
  }

  // ===== Selection =====
  onSelectionChange(ids: number[]): void {
    this.selectedIds.set(ids);
  }

  onDeselectAll(): void {
    this.selectedIds.set([]);
  }

  // ===== Table Actions =====
  onView(id: number): void {
    this.viewingBookId.set(id);
    this.showViewModal.set(true);
  }

  onEdit(id: number): void {
    this.editingBookId.set(id);
    this.showEditModal.set(true);
  }

  onDelete(id: number): void {
    const book = this.books().find(b => b.id === id) || null;
    this.deletingBook.set(book);
    this.showDeleteModal.set(true);
  }

  // ===== Modal Close Handlers =====
  closeCreateModal(): void {
    this.showCreateModal.set(false);
  }

  closeViewModal(): void {
    this.showViewModal.set(false);
    this.viewingBookId.set(null);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.editingBookId.set(null);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.deletingBook.set(null);
  }

  // ===== Modal Success Handlers =====
  onBookCreated(): void {
    this.loadBooks();
    this.loadStatistics();
  }

  onBookUpdated(updatedBook: Book): void {
    // Update the book in the list
    const currentBooks = this.books();
    const index = currentBooks.findIndex(b => b.id === updatedBook.id);
    if (index !== -1) {
      const newBooks = [...currentBooks];
      newBooks[index] = updatedBook;
      this.books.set(newBooks);
    }
    this.loadStatistics();
  }

  onBookDeleted(deletedId: number): void {
    // Remove the book from the list
    const currentBooks = this.books();
    this.books.set(currentBooks.filter(b => b.id !== deletedId));
    this.totalElements.update(v => Math.max(0, v - 1));
    this.loadStatistics();
  }

  // ===== Header Actions =====
  onAddBook(): void {
    this.showCreateModal.set(true);
  }

  onBarcodeScan(): void {
    console.log('Barcode scan');
  }

  onExportExcel(): void {
    console.log('Export Excel');
  }

  // ===== Bulk Actions =====
  onPrintBarcode(): void {
    console.log('Print barcode for:', this.selectedIds());
  }

  onMoveShelf(): void {
    console.log('Move shelf for:', this.selectedIds());
  }

  onExportList(): void {
    console.log('Export list for:', this.selectedIds());
  }
}
