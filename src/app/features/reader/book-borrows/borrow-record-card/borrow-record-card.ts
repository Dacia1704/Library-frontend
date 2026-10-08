import { Component, Input, signal } from '@angular/core';
import { BorrowDetail } from '@model/borrow-record/borrow-detail';
import { BorrowStatus } from '@model/enum/borrow-status.enum';
import { ImageUtils } from '@shared/utils/image-utils';

@Component({
  selector: 'app-borrow-record-card',
  standalone: true,
  imports: [],
  templateUrl: './borrow-record-card.html',
  styleUrls: ['./borrow-record-card.scss'],
})
export class BorrowRecordCard {
  @Input({ required: true }) record!: BorrowDetail;

  expanded = signal<boolean>(false);

  ngOnInit() {
    // Default expanded = true khi quá hạn
    this.expanded.set(this.isOverdueUnReturned);
  }

  toggle() {
    this.expanded.update(v => !v);
  }

  // ─── Computed helpers ───────────────────────────────────────────────

  get isOverdueReturned(): boolean {
    return this.record.borrowStatus === BorrowStatus.RETURNED && this.record.returnDate != null && this.record.returnDate > this.record.borrowRecord.dueDate;
  }
  get isOverdueUnReturned(): boolean {
    return this.record.borrowStatus === BorrowStatus.OVERDUE && this.record.borrowRecord.dueDate < new Date();
  }

  get isReturned(): boolean {
    return this.record.borrowStatus === BorrowStatus.RETURNED;
  }

  get statusTone(): string {
    const s = this.record.borrowStatus;
    if (s === BorrowStatus.OVERDUE) return 'error';
    if (s === BorrowStatus.BORROWING) return 'secondary';
    if (s === BorrowStatus.RETURNED) return 'muted';
    return 'neutral';
  }

  get statusLabel(): string {
    const s = this.record.borrowStatus;
    if (s === BorrowStatus.OVERDUE) return 'Quá hạn';
    if (s === BorrowStatus.BORROWING) return 'Đang mượn';
    if (s === BorrowStatus.RETURNED) return 'Đã trả';
    return s; // fallback hiển thị giá trị gốc
  }

  get statusIcon(): string {
    const s = this.record.borrowStatus;
    if (s === BorrowStatus.OVERDUE) return 'priority_high';
    if (s === BorrowStatus.BORROWING) return 'auto_stories';
    if (s === BorrowStatus.RETURNED) return 'task_alt';
    return 'history';
  }

  get borrowDateLabel(): string {
    const d = this.record.borrowRecord.borrowDate;
    if (!d) return '';
    return d.toLocaleDateString('vi-VN');
  }

  get returnDateLabel(): string {
    const d = this.record.returnDate;
    if (!d) return '';
    return d.toLocaleDateString('vi-VN');
  }

  get dueDateLabel(): string {
    const d = this.record.borrowRecord.dueDate;
    if (!d) return '';
    const label = d.toLocaleDateString('vi-VN');

    if (this.isOverdueUnReturned || this.isOverdueReturned) {
      const days = Math.ceil((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
      return `${label} (Quá hạn ${days} ngày)`;
    }
    if(!this.isReturned) {
      const days = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (days > 0) return `${label} (Còn ${days} ngày)`;
    }
    return label;
  }

  get dueDateTone(): string {
    if (this.isOverdueUnReturned) return 'error';
    if (this.record.borrowStatus === BorrowStatus.BORROWING) return 'secondary';
    return 'neutral';
  }

  get fineLabel(): string {
    if (this.record.borrowStatus === BorrowStatus.OVERDUE) return 'Tiền phạt tạm tính';
    if (this.record.borrowStatus === BorrowStatus.RETURNED) return 'Tổng phạt';
    return 'Tình trạng phí';
  }

  get fineTone(): string {
    if ((this.record.fineAmount ?? 0) > 0) return 'error';
    return 'secondary';
  }

  get fineAmountVnd(): string {
    return (this.record.fineAmount ?? 0).toLocaleString('vi-VN') + ' VNĐ';
  }

  get librarianLabel(): string {
    const lib = this.record.borrowRecord.librarian;
    return lib?.displayName ?? '';
  }

  get bookTitle(): string {
    return this.record.book?.title ?? '';
  }

  get bookAuthor(): string {
    const authors = this.record.book?.authors;
    if (!authors?.length) return '';
    return authors.map(a => a.name).join(', ');
  }

  get bookCoverSrc(): string {
    return ImageUtils.toImageSrc(this.record.book?.cover);
  }

  get bookCode(): string {
    return this.record.book?.bookCode ?? '';
  }

  get shelfCode(): string {
    return this.record.book?.shelf?.code ?? '';
  }

  get shelfLocation(): string {
    return this.record.book?.shelf?.location ?? '';
  }

  get recordIdLabel(): string {
    return String(this.record.borrowRecord.id);
  }

  get borrowIdLable(): string {
    return String(this.record.id);
  }

  get toggleIcon(): string {
    return this.expanded() ? 'expand_less' : 'expand_more';
  }

  get toggleLabel(): string {
    return this.expanded() ? 'Thu gọn chi tiết' : 'Xem chi tiết';
  }
}
