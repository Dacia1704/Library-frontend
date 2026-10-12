import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Shelf } from '@model/shelf/shelf.model';

@Component({
  selector: 'app-cat-auth-pub-shelf-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cat-auth-pub-shelf-grid.html',
  styleUrls: ['./cat-auth-pub-shelf-grid.scss'],
})
export class CatAuthPubShelfGridComponent {
  @Input() shelves: Shelf[] = [];
  @Input() loading = false;

  @Output() edit = new EventEmitter<Shelf>();
  @Output() delete = new EventEmitter<Shelf>();

  getInitials(name: string): string {
    if (!name) return 'KS';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getShelfCode(code: string): string {
    if (!code) return 'KS-?';
    return code.toUpperCase();
  }

  onEdit(shelf: Shelf): void {
    this.edit.emit(shelf);
  }

  onDelete(shelf: Shelf): void {
    this.delete.emit(shelf);
  }
}
