import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-book-bulk-actions',
  standalone: true,
  imports: [],
  templateUrl: './book-bulk-actions.html',
  styleUrls: ['./book-bulk-actions.scss'],
})
export class BookBulkActionsComponent {
  readonly selectedCount = input<number>(0);
  readonly visible = input<boolean>(false);

  readonly printBarcode = output<void>();
  readonly moveShelf = output<void>();
  readonly exportList = output<void>();
  readonly deselectAll = output<void>();
}
