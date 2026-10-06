import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '@model/book/book.model';

@Component({
  selector: 'app-book-card',
  imports: [],
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss',
})
export class BookCard {
  @Input({ required: true }) book!: Book;

  private router = inject(Router);

  get isAvailable() {
    return this.book.available > 0;
  }

  onCardClick(): void {
    this.router.navigate(['reader/books', this.book.id]);
  }
}
