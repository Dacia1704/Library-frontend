import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { BookDetailToolbar } from './book-detail-toolbar/book-detail-toolbar';
import { BookCoverVisual } from './book-cover-visual/book-cover-visual';
import { BookAvailabilityStatus } from './book-availability-status/book-availability-status';
import { BookMetadata } from './book-metadata/book-metadata';
import { BookSynopsis } from './book-synopsis/book-synopsis';
import { BookLocationTag } from './book-location-tag/book-location-tag';
import { BookBorrowRules } from './book-borrow-rules/book-borrow-rules';

import { Book } from '@model/book/book.model';
import { BookService } from '@services/book.service';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    BookDetailToolbar,
    BookCoverVisual,
    BookLocationTag,
    BookAvailabilityStatus,
    BookMetadata,
    BookSynopsis,
    BookBorrowRules
  ],
  templateUrl: './book-detail.html',
  styleUrls: ['./book-detail.scss']
})
export class BookDetail implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly titleService = inject(Title);
  private readonly bookService = inject(BookService);
  private readonly toast = inject(ToastService);

  book = signal<Book | null>(null);
  isLoading = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.toast.error('ID sách không hợp lệ');
      return;
    }

    this.loadBook(id);
  }

  private loadBook(id: number): void {
    this.isLoading.set(true);

    this.bookService.getById(String(id)).subscribe({
      next: response => {
        this.book.set(response.data);

        console.log(this.book());

        this.titleService.setTitle(
          `${response.data.title} - Chi tiết sách`
        );

        this.isLoading.set(false);
      },

      error: error => {
        console.error('Lỗi khi tải thông tin sách:', error);
        this.toast.error('Không thể tải thông tin sách');
        this.isLoading.set(false);
      }
    });
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}