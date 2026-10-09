import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-borrow-create-header',
  standalone: true,
  imports: [],
  templateUrl: './borrow-create-header.html',
  styleUrls: ['./borrow-create-header.scss'],
})
export class BorrowCreateHeaderComponent {
  @Input() librarian: {
    name: string;
    id: string;
  } = { name: '', id: '' };

  @Output() onRefresh = new EventEmitter<void>();
}
