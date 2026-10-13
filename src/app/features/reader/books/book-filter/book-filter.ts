import { Component, computed, output, signal, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthorService } from '@services/author.service';
import { PublisherService } from '@services/publisher.service';
import { CategoryService } from '@services/category.service';
import { forkJoin } from 'rxjs';

export interface BookFilterValue {
  search: string;
  categoryIds: number[];
  authorIds: number[];
  publisherIds: number[];
  yearFrom: number;
  yearTo: number;
  minQuantity: number;
  maxQuantity: number;
  minAvailable: number;
  maxAvailable: number;
}

@Component({
  selector: 'app-book-filter',
  imports: [FormsModule],
  templateUrl: './book-filter.html',
  styleUrl: './book-filter.scss',
})
export class BookFilter implements OnInit {
  filterChange = output<BookFilterValue>();

  private authorService = inject(AuthorService);
  private publisherService = inject(PublisherService);
  private categoryService = inject(CategoryService);

  // Slider boundaries
  minYear = 1950;
  maxYear = new Date().getFullYear();
  maxQuantity = 100;
  maxAvailable = 50;

  filter: BookFilterValue = {
    search: '',
    categoryIds: [],
    authorIds: [],
    publisherIds: [],
    yearFrom: this.minYear,
    yearTo: this.maxYear,
    minQuantity: 0,
    maxQuantity: this.maxQuantity,
    minAvailable: 0,
    maxAvailable: this.maxAvailable,
  };

  // Dropdown state
  dropdownOpen = signal<string | null>(null);

  // Computed percentages for range slider visual
  yearMinPercent = computed(() => ((this.filter.yearFrom - this.minYear) / (this.maxYear - this.minYear)) * 100);
  yearMaxPercent = computed(() => ((this.filter.yearTo - this.minYear) / (this.maxYear - this.minYear)) * 100);
  quantityMinPercent = computed(() => (this.filter.minQuantity / this.maxQuantity) * 100);
  quantityMaxPercent = computed(() => (this.filter.maxQuantity / this.maxQuantity) * 100);
  availableMinPercent = computed(() => (this.filter.minAvailable / this.maxAvailable) * 100);
  availableMaxPercent = computed(() => (this.filter.maxAvailable / this.maxAvailable) * 100);

  categories = signal<{ id: number; name: string }[]>([]);
  authors = signal<{ id: number; name: string }[]>([]);
  publishers = signal<{ id: number; name: string }[]>([]);

  ngOnInit(): void {
    this.loadFilterOptions();
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }

  private handleOutsideClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.multi-select-wrap')) {
      this.dropdownOpen.set(null);
    }
  }

  private loadFilterOptions(): void {
    forkJoin({
      categories: this.categoryService.getCategories(),
      authors: this.authorService.getAuthors(),
      publishers: this.publisherService.getPublishers(),
    }).subscribe({
      next: ({ categories, authors, publishers }) => {
        this.categories.set(categories.data);
        this.authors.set(authors.data);
        this.publishers.set(publishers.data);
      },
      error: (err) => {
        console.error('Lỗi khi tải dữ liệu filter:', err);
      }
    });
  }

  // Dropdown methods
  toggleDropdown(name: string): void {
    this.dropdownOpen.set(this.dropdownOpen() === name ? null : name);
  }

  // Multi-select methods
  isSelected(arrayKey: 'categoryIds' | 'authorIds' | 'publisherIds', id: number): boolean {
    return this.filter[arrayKey].includes(id);
  }

  toggleSelection(arrayKey: 'categoryIds' | 'authorIds' | 'publisherIds', id: number): void {
    const arr = this.filter[arrayKey];
    const index = arr.indexOf(id);
    if (index === -1) {
      arr.push(id);
    } else {
      arr.splice(index, 1);
    }
    this.search();
  }

  // Range slider methods - ensure min <= max
  onYearMinChange(): void {
    if (this.filter.yearFrom > this.filter.yearTo) {
      this.filter.yearFrom = this.filter.yearTo;
    }
  }

  onYearMaxChange(): void {
    if (this.filter.yearTo < this.filter.yearFrom) {
      this.filter.yearTo = this.filter.yearFrom;
    }
  }

  onQuantityMinChange(): void {
    if (this.filter.minQuantity > this.filter.maxQuantity) {
      this.filter.minQuantity = this.filter.maxQuantity;
    }
  }

  onQuantityMaxChange(): void {
    if (this.filter.maxQuantity < this.filter.minQuantity) {
      this.filter.maxQuantity = this.filter.minQuantity;
    }
  }

  onAvailableMinChange(): void {
    if (this.filter.minAvailable > this.filter.maxAvailable) {
      this.filter.minAvailable = this.filter.maxAvailable;
    }
  }

  onAvailableMaxChange(): void {
    if (this.filter.maxAvailable < this.filter.minAvailable) {
      this.filter.maxAvailable = this.filter.minAvailable;
    }
  }

  search(): void {
    this.filterChange.emit({ ...this.filter });
  }

  reset(): void {
    this.filter = {
      search: '',
      categoryIds: [],
      authorIds: [],
      publisherIds: [],
      yearFrom: this.minYear,
      yearTo: this.maxYear,
      minQuantity: 0,
      maxQuantity: this.maxQuantity,
      minAvailable: 0,
      maxAvailable: this.maxAvailable,
    };
    this.filterChange.emit({ ...this.filter });
  }
}
