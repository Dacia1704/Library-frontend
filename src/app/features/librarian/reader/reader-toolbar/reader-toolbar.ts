import { Component, output, signal } from '@angular/core';
import { MemberFilter } from '@model/member/request/member-filter';

@Component({
  selector: 'app-reader-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './reader-toolbar.html',
  styleUrls: ['./reader-toolbar.scss'],
})
export class ReaderToolbarComponent {
  readonly register = output<void>();
  readonly filterChange = output<MemberFilter>();

  readonly keyword = signal('');

  onKeywordChange(value: string): void {
    this.keyword.set(value);
    this.emitFilter();
  }

  onSearch(): void {
    this.emitFilter();
  }

  onRegister(): void {
    this.register.emit();
  }

  private emitFilter(): void {
    this.filterChange.emit({
      keyword: this.keyword() || undefined
    });
  }
}
