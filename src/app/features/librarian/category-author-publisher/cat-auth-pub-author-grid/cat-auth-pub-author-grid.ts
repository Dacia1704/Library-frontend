import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Author } from '@model/author/author.model';

@Component({
  selector: 'app-cat-auth-pub-author-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cat-auth-pub-author-grid.html',
  styleUrls: ['./cat-auth-pub-author-grid.scss'],
})
export class CatAuthPubAuthorGridComponent {
  @Input() authors: Author[] = [];
  @Input() loading = false;

  @Output() edit = new EventEmitter<Author>();
  @Output() delete = new EventEmitter<Author>();

  getInitials(name: string): string {
    if (!name) return 'NA';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  onEdit(author: Author): void {
    this.edit.emit(author);
  }

  onDelete(author: Author): void {
    this.delete.emit(author);
  }
}
