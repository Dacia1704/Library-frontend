import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '@model/category/category.model';

@Component({
  selector: 'app-cat-auth-pub-category-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cat-auth-pub-category-table.html',
  styleUrls: ['./cat-auth-pub-category-table.scss'],
})
export class CatAuthPubCategoryTableComponent {
  @Input() categories: Category[] = [];
  @Input() loading = false;
  @Input() showDeleted = true;

  @Output() edit = new EventEmitter<Category>();
  @Output() delete = new EventEmitter<Category>();
  @Output() restore = new EventEmitter<Category>();
  @Output() permanentDelete = new EventEmitter<Category>();

  onEdit(category: Category): void {
    this.edit.emit(category);
  }

  onDelete(category: Category): void {
    this.delete.emit(category);
  }

  onRestore(category: Category): void {
    this.restore.emit(category);
  }

  onPermanentDelete(category: Category): void {
    this.permanentDelete.emit(category);
  }
}
