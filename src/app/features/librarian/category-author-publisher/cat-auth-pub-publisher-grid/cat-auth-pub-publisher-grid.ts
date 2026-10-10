import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Publisher } from '@model/publisher/publisher.model';

@Component({
  selector: 'app-cat-auth-pub-publisher-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cat-auth-pub-publisher-grid.html',
  styleUrls: ['./cat-auth-pub-publisher-grid.scss'],
})
export class CatAuthPubPublisherGridComponent {
  @Input() publishers: Publisher[] = [];
  @Input() loading = false;

  @Output() edit = new EventEmitter<Publisher>();
  @Output() delete = new EventEmitter<Publisher>();

  getInitials(name: string): string {
    if (!name) return 'NXB';
    const parts = name.trim().split(/\s+/);
    const initials = parts.map(p => p[0]).join('').substring(0, 3);
    return initials.toUpperCase();
  }

  onEdit(publisher: Publisher): void {
    this.edit.emit(publisher);
  }

  onDelete(publisher: Publisher): void {
    this.delete.emit(publisher);
  }
}
