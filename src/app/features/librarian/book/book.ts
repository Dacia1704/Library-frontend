import { Component, inject, OnInit, signal } from '@angular/core';
import { BookBreadcrumbComponent } from './book-breadcrumb/book-breadcrumb';
import { BookHeaderComponent } from './book-header/book-header';
import { BookStatsComponent } from './book-stats/book-stats';
import { BookSearchComponent } from './book-search/book-search';
import { BookTableComponent } from './book-table/book-table';
import { BookBulkActionsComponent } from './book-bulk-actions/book-bulk-actions';

import { BookService } from '@services/book.service';
import { CategoryService } from '@services/category.service';
import { AuthorService } from '@services/author.service';
import { PublisherService } from '@services/publisher.service';

import { Book } from '@model/book/book.model';
import { BookFilter } from '@model/book/request/book-filter';
import { BookStatisticsResponse } from '@model/book/response/book-statistics-response';
import { Category } from '@model/category/category.model';
import { Author } from '@model/author/author.model';
import { Publisher } from '@model/publisher/publisher.model';

@Component({
  selector: 'app-book-page',
  standalone: true,
  imports: [
    BookBreadcrumbComponent,
    BookHeaderComponent,
    BookStatsComponent,
    BookSearchComponent,
    BookTableComponent,
    BookBulkActionsComponent,
  ],
  templateUrl: './book.html',
  styleUrls: ['./book.scss'],
})
export class BookPage implements OnInit {
  private readonly bookService = inject(BookService);
  private readonly categoryService = inject(CategoryService);
  private readonly authorService = inject(AuthorService);
  private readonly publisherService = inject(PublisherService);

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
  readonly years = signal<number[]>([2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018]);

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.loadStatistics();
    this.loadBooks();
    this.loadCategories();
    this.loadAuthors();
    this.loadPublishers();
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
    console.log('View book:', id);
    // TODO: Navigate to book detail
  }

  onEdit(id: number): void {
    console.log('Edit book:', id);
    // TODO: Open edit modal
  }

  onDelete(id: number): void {
    console.log('Delete book:', id);
    // TODO: Confirm and delete
  }

  // ===== Header Actions =====
  onAddBook(): void {
    console.log('Add new book');
    // TODO: Open add book modal
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
