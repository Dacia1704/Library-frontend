import { Component, Input, computed, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface BookFilterValue {
  search: string;
  category: string;
  author: string;
  publisher: string;
  yearFrom: number | null;
  yearTo: number | null;
  onlyAvailable: boolean;
}

interface ActiveChip { key: keyof BookFilterValue; label: string; }

@Component({
  selector: 'app-book-filter',
  imports: [FormsModule],
  templateUrl: './book-filter.html',
  styleUrl: './book-filter.scss',
})
export class BookFilter {
  filterChange = output<BookFilterValue>();

  filter: BookFilterValue = {
    search: '',
    category: '',
    author: '',
    publisher: '',
    yearFrom: null,
    yearTo: null,
    onlyAvailable: true,
  };

  activeChips = signal<ActiveChip[]>([]);

  categories = [
    'Tất cả danh mục',
    'Khoa học & Công nghệ',
    'Kinh tế & Quản trị',
    'Văn học & Tiểu thuyết',
    'Tâm lý học & Kỹ năng',
    'Lịch sử & Triết học',
    'Kỹ năng sống',
  ];

  authors = [
    'Tất cả tác giả',
    'Nguyễn Nhật Ánh',
    'Dale Carnegie',
    'Paulo Coelho',
    'Don Norman',
    'Rosie Nguyễn',
    'Yuval Noah Harari',
    'Daniel Kahneman',
  ];

  publishers = [
    'Tất cả nhà xuất bản',
    'NXB Trẻ',
    'NXB Kim Đồng',
    'NXB Tổng hợp TP.HCM',
    'NXB Tri thức',
    'NXB Văn Học',
    'NXB Thế Giới',
    'NXB Hội Nhà Văn',
  ];

  search() {
    this.updateChips();
    this.filterChange.emit({ ...this.filter });
  }

  reset() {
    this.filter = { search: '', category: '', author: '', publisher: '', yearFrom: null, yearTo: null, onlyAvailable: false };
    this.activeChips.set([]);
    this.filterChange.emit({ ...this.filter });
  }

  clearChip(key: keyof BookFilterValue) {
    if (key === 'onlyAvailable') this.filter.onlyAvailable = false;
    else (this.filter as any)[key] = '';
    this.updateChips();
    this.filterChange.emit({ ...this.filter });
  }

  private updateChips() {
    const chips: ActiveChip[] = [];
    if (this.filter.category && !this.filter.category.startsWith('Tất cả'))
      chips.push({ key: 'category', label: `Danh mục: ${this.filter.category}` });
    if (this.filter.author && !this.filter.author.startsWith('Tất cả'))
      chips.push({ key: 'author', label: `Tác giả: ${this.filter.author}` });
    if (this.filter.publisher && !this.filter.publisher.startsWith('Tất cả'))
      chips.push({ key: 'publisher', label: `NXB: ${this.filter.publisher}` });
    if (this.filter.onlyAvailable)
      chips.push({ key: 'onlyAvailable', label: 'Trạng thái: Sẵn sàng mượn' });
    this.activeChips.set(chips);
  }
}
