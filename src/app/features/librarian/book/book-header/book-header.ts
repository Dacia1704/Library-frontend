import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-book-header',
  standalone: true,
  imports: [],
  templateUrl: './book-header.html',
  styleUrls: ['./book-header.scss'],
})
export class BookHeaderComponent {
  readonly shelfName = input<string>('Kho lưu trữ số 1');
  readonly totalBooks = input<number>(0);
  readonly totalCopies = input<number>(0);
  readonly borrowedCopies = input<number>(0);
  readonly outOfStockCount = input<number>(0);

  readonly onAddBook = output<void>();
  readonly onBarcodeScan = output<void>();
  readonly onExportExcel = output<void>();
  readonly onRefresh = output<void>();
}
