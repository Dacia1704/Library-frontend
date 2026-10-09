import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-return-book-header',
  standalone: true,
  imports: [],
  templateUrl: './return-book-header.html',
  styleUrls: ['./return-book-header.scss'],
})
export class ReturnBookHeaderComponent {
  @Input() librarianName = '';
  @Input() librarianRole = '';
  @Input() shiftDesk = '01';

  @Output() onRefresh = new EventEmitter<void>();
  @Output() onHistory = new EventEmitter<void>();
}
