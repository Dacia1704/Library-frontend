import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { BookCard } from "./book-card/book-card";
import { BookFilter, BookFilterValue } from "./book-filter/book-filter";
import { Book } from "@model/book/book.model";
import { BookFilter as BookFilterModel } from "@model/book/request/book-filter";
import { BookService } from "@services/book.service";

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, BookCard, BookFilter],
  templateUrl: './books.html',
  styleUrls: ['./books.scss']
})
export class Books implements OnInit {
  readonly Math = Math;

  private bookService = inject(BookService);

  filteredBooks = signal<Book[]>([]);
  totalBooks = signal(0);
  isLoading = signal(false);
  page = 1;
  size = 12;

  private currentFilter: BookFilterModel = this.buildDefaultFilter();

  ngOnInit(): void {
    this.loadBooks();
  }

  onFilterChange(filterValue: BookFilterValue) {
    this.page = 1;
    this.currentFilter = this.mapFilter(filterValue);
    this.loadBooks();
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadBooks();
  }

  onSizeChange(size: number) {
    this.size = size;
    this.page = 1;
    this.loadBooks();
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.totalBooks() / this.size);
    const pages: number[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (this.page > 3) pages.push(-1); // ellipsis
      for (let i = Math.max(2, this.page - 1); i <= Math.min(totalPages - 1, this.page + 1); i++)
        pages.push(i);
      if (this.page < totalPages - 2) pages.push(-1); // ellipsis
      pages.push(totalPages);
    }
    return pages;
  }

  private loadBooks(): void {
    this.isLoading.set(true);
    this.bookService.getPagination(this.currentFilter, this.page - 1, this.size).subscribe({
      next: response => {
        const page = response.data;
        this.filteredBooks.set([...page.data]);
        this.totalBooks.set(page.totalElements ?? 0);
        this.isLoading.set(false);
      },
      error: err => {
        console.error('Lỗi khi tải danh sách sách:', err);
        this.isLoading.set(false);
      }
    });
  }

  private mapFilter(filterValue: BookFilterValue): BookFilterModel {
    return {
      keyword: filterValue.search ?? '',
      isbn: '',
      minPublishYear: filterValue.yearFrom ?? 0,
      maxPublishYear: filterValue.yearTo ?? 9999,
      minQuantity: 0,
      maxQuantity: 9999,
      minAvailable: filterValue.onlyAvailable ? 1 : 0,
      maxAvailable: 9999,
      categoryIds: [],
      authorIds: [],
      publisherIds: [],
    };
  }

  private buildDefaultFilter(): BookFilterModel {
    return {
      keyword: '',
      isbn: '',
      minPublishYear: 0,
      maxPublishYear: 9999,
      minQuantity: 0,
      maxQuantity: 9999,
      minAvailable: 0,
      maxAvailable: 9999,
      categoryIds: [],
      authorIds: [],
      publisherIds: [],
    };
  }
}