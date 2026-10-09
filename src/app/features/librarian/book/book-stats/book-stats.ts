import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BookStatisticsResponse } from '@model/book/response/book-statistics-response';

@Component({
  selector: 'app-book-stats',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './book-stats.html',
  styleUrls: ['./book-stats.scss'],
})
export class BookStatsComponent {
  readonly stats = input.required<BookStatisticsResponse>();
}
