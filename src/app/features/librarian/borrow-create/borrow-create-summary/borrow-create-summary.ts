import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '@model/book/book.model';

@Component({
  selector: 'app-borrow-create-summary',
  standalone: true,
  imports: [],
  templateUrl: './borrow-create-summary.html',
  styleUrls: ['./borrow-create-summary.scss'],
})
export class BorrowCreateSummaryComponent {
  @Input() librarian: {
    name: string;
    id: string;
  } = { name: '', id: '' };
  @Input() selectedPatron: any = null;
  @Input() selectedBooks: Book[] = [];
  @Input() borrowDays = 14;
  @Input() dueDate = '';
  @Input() notes = '';
  @Input() quotaText = '0/5';
  @Input() canCreate = false;

  @Output() daysChange = new EventEmitter<Event>();
  @Output() daysSet = new EventEmitter<number>();
  @Output() notesChange = new EventEmitter<Event>();
  @Output() submit = new EventEmitter<void>();
  @Output() print = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() bookRemove = new EventEmitter<number>();

  get maxQuota(): number {
    return 5;
  }

  get today(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  }

  bookCode(book: Book): string {
    return book?.bookCode ?? '';
  }

  bookShelf(book: Book): string {
    if (!book?.shelf) return '';
    const code = book.shelf.code ?? '';
    const name = book.shelf.name ?? '';
    return name ? `${code} - ${name}` : code;
  }

  onDaysChange(event: Event): void {
    this.daysChange.emit(event);
  }

  onDaysSet(days: number): void {
    this.daysSet.emit(days);
  }

  onNotesChange(event: Event): void {
    this.notesChange.emit(event);
  }

  onSubmit(): void {
    this.submit.emit();
  }

  onPrint(): void {
    this.print.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onBookRemove(bookId: number): void {
    this.bookRemove.emit(bookId);
  }
}
