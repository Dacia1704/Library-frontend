import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-return-book-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './return-book-search.html',
  styleUrls: ['./return-book-search.scss'],
})
export class ReturnBookSearchComponent {
  /** Search keyword */
  @Input() keyword = '';
  @Output() keywordChange = new EventEmitter<string>();
  @Output() loadRecord = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  isLoading = signal(false);

  onKeywordInput(value: string): void {
    this.keywordChange.emit(value);
  }

  onLoadRecord(): void {
    this.loadRecord.emit();
  }

  onRefresh(): void {
    this.refresh.emit();
  }
}
