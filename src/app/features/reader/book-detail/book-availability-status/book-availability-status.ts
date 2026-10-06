import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Book } from '@model/book/book.model';

@Component({
  selector: 'app-book-availability-status',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatCardModule, MatIconModule],
  templateUrl: './book-availability-status.html',
  styleUrls: ['./book-availability-status.scss']
})
export class BookAvailabilityStatus {
  @Input({ required: true }) book!: Book;

  get isAvailable(): boolean {
    return this.book.available > 0;
  }
}