import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookFilter } from '@model/book/request/book-filter';
import { Category } from '@model/category/category.model';
import { Author } from '@model/author/author.model';
import { Publisher } from '@model/publisher/publisher.model';

@Component({
  selector: 'app-book-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './book-search.html',
  styleUrls: ['./book-search.scss'],
})
export class BookSearchComponent {
  readonly categories = input<Category[]>([]);
  readonly authors = input<Author[]>([]);
  readonly publishers = input<Publisher[]>([]);
  readonly years = input<number[]>([]);

  readonly filterChange = output<BookFilter>();
  readonly reset = output<void>();

  isClearVisible = signal(false);

  private currentFilter = {
    keyword: '',
    isbn: '',
    minPublishYear: null as number | null,
    maxPublishYear: null as number | null,
    stockStatus: 'all',
    categoryIds: [] as number[],
    authorIds: [] as number[],
    publisherIds: [] as number[],
  };

  private buildAndEmit(): void {
    const stockFilter = this.getStockFilter();
    
    const filter: Partial<BookFilter> = {};

    // Only add non-empty values
    if (this.currentFilter.keyword.trim()) {
      filter.keyword = this.currentFilter.keyword;
    }
    if (this.currentFilter.isbn.trim()) {
      filter.isbn = this.currentFilter.isbn;
    }
    if (this.currentFilter.minPublishYear !== null) {
      filter.minPublishYear = this.currentFilter.minPublishYear;
    }
    if (this.currentFilter.maxPublishYear !== null) {
      filter.maxPublishYear = this.currentFilter.maxPublishYear;
    }
    if (stockFilter.minAvailable > 0) {
      filter.minAvailable = stockFilter.minAvailable;
    }
    if (stockFilter.maxAvailable > 0) {
      filter.maxAvailable = stockFilter.maxAvailable;
    }
    if (this.currentFilter.categoryIds.length > 0) {
      filter.categoryIds = this.currentFilter.categoryIds;
    }
    if (this.currentFilter.authorIds.length > 0) {
      filter.authorIds = this.currentFilter.authorIds;
    }
    if (this.currentFilter.publisherIds.length > 0) {
      filter.publisherIds = this.currentFilter.publisherIds;
    }

    this.filterChange.emit(filter as BookFilter);
  }

  private getStockFilter(): { minAvailable: number; maxAvailable: number } {
    switch (this.currentFilter.stockStatus) {
      case 'available':
        return { minAvailable: 1, maxAvailable: 0 };
      case 'out_of_stock':
        return { minAvailable: 0, maxAvailable: 0 };
      case 'low_stock':
        return { minAvailable: 1, maxAvailable: 2 };
      default:
        return { minAvailable: 0, maxAvailable: 0 };
    }
  }

  // ===== Dropdown state for multi-select =====
  readonly openDropdown = signal<string | null>(null);

  toggleDropdown(name: 'category' | 'author' | 'publisher'): void {
    if (this.openDropdown() === name) {
      this.openDropdown.set(null);
    } else {
      this.openDropdown.set(name);
    }
  }

  closeDropdowns(): void {
    this.openDropdown.set(null);
  }

  // ===== Count helpers =====
  getSelectedCategoriesCount(): number {
    return this.currentFilter.categoryIds.length;
  }

  getSelectedAuthorsCount(): number {
    return this.currentFilter.authorIds.length;
  }

  getSelectedPublishersCount(): number {
    return this.currentFilter.publisherIds.length;
  }

  // ===== Multi-select for Categories =====
  isCategorySelected(id: number): boolean {
    return this.currentFilter.categoryIds.includes(id);
  }

  toggleCategory(id: number): void {
    const index = this.currentFilter.categoryIds.indexOf(id);
    if (index > -1) {
      this.currentFilter.categoryIds.splice(index, 1);
    } else {
      this.currentFilter.categoryIds.push(id);
    }
    this.buildAndEmit();
  }

  clearCategories(): void {
    this.currentFilter.categoryIds = [];
    this.buildAndEmit();
  }

  // ===== Multi-select for Authors =====
  isAuthorSelected(id: number): boolean {
    return this.currentFilter.authorIds.includes(id);
  }

  toggleAuthor(id: number): void {
    const index = this.currentFilter.authorIds.indexOf(id);
    if (index > -1) {
      this.currentFilter.authorIds.splice(index, 1);
    } else {
      this.currentFilter.authorIds.push(id);
    }
    this.buildAndEmit();
  }

  clearAuthors(): void {
    this.currentFilter.authorIds = [];
    this.buildAndEmit();
  }

  // ===== Multi-select for Publishers =====
  isPublisherSelected(id: number): boolean {
    return this.currentFilter.publisherIds.includes(id);
  }

  togglePublisher(id: number): void {
    const index = this.currentFilter.publisherIds.indexOf(id);
    if (index > -1) {
      this.currentFilter.publisherIds.splice(index, 1);
    } else {
      this.currentFilter.publisherIds.push(id);
    }
    this.buildAndEmit();
  }

  clearPublishers(): void {
    this.currentFilter.publisherIds = [];
    this.buildAndEmit();
  }

  // ===== Single-select filters =====
  onKeywordChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.isClearVisible.set(input.value.length > 0);
    this.currentFilter.keyword = input.value;
    this.buildAndEmit();
  }

  onClearSearch(): void {
    this.currentFilter.keyword = '';
    this.isClearVisible.set(false);
    this.buildAndEmit();
  }

  onIsbnChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.currentFilter.isbn = input.value;
    this.buildAndEmit();
  }

  onYearChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    if (value === 'all') {
      this.currentFilter.minPublishYear = null;
      this.currentFilter.maxPublishYear = null;
    } else {
      const year = Number(value);
      this.currentFilter.minPublishYear = year;
      this.currentFilter.maxPublishYear = year;
    }
    this.buildAndEmit();
  }

  onStockStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.currentFilter.stockStatus = select.value;
    this.buildAndEmit();
  }

  onReset(): void {
    this.currentFilter = {
      keyword: '',
      isbn: '',
      minPublishYear: null,
      maxPublishYear: null,
      stockStatus: 'all',
      categoryIds: [],
      authorIds: [],
      publisherIds: [],
    };
    this.isClearVisible.set(false);
    // Emit empty filter object
    this.filterChange.emit({} as BookFilter);
    this.reset.emit();
  }
}
