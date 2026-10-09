import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Stats {
  categoryCount: number;
  authorCount: number;
  publisherCount: number;
  deletedCount: number;
}

@Component({
  selector: 'app-cat-auth-pub-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cat-auth-pub-header.html',
  styleUrls: ['./cat-auth-pub-header.scss'],
})
export class CatAuthPubHeaderComponent {
  @Input() stats: Stats = {
    categoryCount: 0,
    authorCount: 0,
    publisherCount: 0,
    deletedCount: 0,
  };

  @Output() export = new EventEmitter<void>();
  @Output() create = new EventEmitter<void>();

  onExport(): void {
    this.export.emit();
  }

  onCreate(): void {
    this.create.emit();
  }
}
