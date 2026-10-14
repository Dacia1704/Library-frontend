import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

import { Member } from '@model/member/member.model';
import { Book } from '@model/book/book.model';
import { MemberService } from '@core/services/member.service';
import { BookService } from '@core/services/book.service';
import { BorrowDetailService } from '@core/services/borrow-detail.service';
import { FineService } from '@core/services/fine.service';
import { FinePaymentService } from '@core/services/fine-payment.service';
import { SettingService } from '@core/services/setting.service';

import { ImageUtils } from '@shared/utils/image-utils';
import { TextUtils } from '@shared/utils/text-utils';

@Component({
  selector: 'app-borrow-create-flow',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './borrow-create-flow.html',
  styleUrls: ['./borrow-create-flow.scss'],
})
export class BorrowCreateFlowComponent implements OnInit {
  @Input() selectedPatron: Member | null = null;
  @Input() selectedBooks: Book[] = [];
  /** Hạn mức tối đa từ setting. Hiện tại đọc tĩnh từ localStorage đã load sẵn. */
  readonly maxQuota = SettingService.getMaxBookBorrow();
  /** Số sách đã chọn trong phiếu hiện tại = selectedBooks.length. */
  get quotaSelected(): number { return this.selectedBooks.length; }
  @Input() hasViolation = false;

  @Output() bookSelected = new EventEmitter<Book>();
  @Output() bookRemoved = new EventEmitter<number>();
  @Output() patronChange = new EventEmitter<Member>();

  // ===== Services =====
  private readonly memberService = inject(MemberService);
  private readonly bookService = inject(BookService);
  private readonly borrowDetailService = inject(BorrowDetailService);
  private readonly fineService = inject(FineService);
  private readonly finePaymentService = inject(FinePaymentService);

  // ===== Patron search =====
  patronKeyword = '';
  patronResults = signal<Member[]>([]);
  patronOpen = signal<boolean>(false);
  isPatronLoading = signal<boolean>(false);
  private readonly patronSearch$ = new Subject<string>();
  private patronSub?: Subscription;

  // ===== Books =====
  bookKeyword = '';
  books = signal<Book[]>([]);
  isBookLoading = signal<boolean>(false);
  private readonly bookSearch$ = new Subject<string>();
  private bookSub?: Subscription;

  ngOnInit(): void {
    this.setupPatronSearch();
    this.setupBookSearch();
    // Initial loads (no keyword)
    this.patronSearch$.next('');
    this.bookSearch$.next('');
  }

  // ===== Patron search wiring =====
  private setupPatronSearch(): void {
    this.patronSub = this.patronSearch$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((kw) => {
          this.isPatronLoading.set(true);
          if (kw && kw.trim().length > 0) {
            return this.memberService.getMembers(kw.trim());
          }
          // No keyword → first page, 10 records (defaults to page 0, size 10)
          return this.memberService.getPagination({}, 0, 10);
        })
      )
      .subscribe({
        next: (res) => {
          // getMembers returns ApiResponse<Member[]>
          // getPagination returns ApiResponse<PageResponse<Member>>
          const data = res.data as unknown;
          let list: Member[] = [];
          if (Array.isArray(data)) {
            list = data as Member[];
          } else if (data && Array.isArray((data as { data?: unknown }).data)) {
            list = (data as { data: Member[] }).data;
          }
          this.patronResults.set(list);
          this.isPatronLoading.set(false);
          this.patronOpen.set(true);
        },
        error: () => {
          this.patronResults.set([]);
          this.isPatronLoading.set(false);
        },
      });
  }

  onPatronKeywordInput(value: string): void {
    this.patronKeyword = value;
    this.patronSearch$.next(value);
  }

  onPatronFocus(): void {
    if (this.patronResults().length > 0) {
      this.patronOpen.set(true);
    }
  }

  onPatronBlur(): void {
    // Close dropdown after a short delay so click event on item can fire
    setTimeout(() => this.patronOpen.set(false), 150);
  }

  selectPatron(member: Member): void {
    this.selectedPatron = member;
    this.patronKeyword = this.formatPatronDisplay(member);
    this.patronOpen.set(false);
    this.patronChange.emit(member);
    this.loadPatronMetrics(member);
  }

  // ===== Books wiring =====
  private setupBookSearch(): void {
    this.bookSub = this.bookSearch$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((kw) => {
          this.isBookLoading.set(true);
          if (kw && kw.trim().length > 0) {
            return this.bookService.getBooks(kw.trim());
          }
          return this.bookService.getPagination(
            this.buildEmptyBookFilter(),
            0,
            10
          );
        })
      )
      .subscribe({
        next: (res) => {
          if (Array.isArray(res.data)) {
            // getPagination returns PageResponse<Book>; flat list accessor depends on service.
            // BookService.getPagination returns ApiResponse<PageResponse<Book>> with data.data array.
            // The block below handles both shapes defensively.
            this.books.set(res.data as Book[]);
          } else if ((res.data as any)?.data) {
            this.books.set((res.data as any).data as Book[]);
          } else {
            this.books.set([]);
          }
          this.isBookLoading.set(false);
        },
        error: () => {
          this.books.set([]);
          this.isBookLoading.set(false);
        },
      });
  }

  private buildEmptyBookFilter(): any {
    // Empty filter shape (matches BookFilter structure)
    return {
      keyword: '',
      isbn: '',
      minPublishYear: 0,
      maxPublishYear: 0,
      minQuantity: 0,
      maxQuantity: 0,
      minAvailable: 0,
      maxAvailable: 0,
      categoryIds: [],
      authorIds: [],
      publisherIds: [],
    };
  }

  onBookKeywordInput(value: string): void {
    this.bookKeyword = value;
    this.bookSearch$.next(value);
  }

  // ===== Patron metrics (booksHeld + fine) =====
  // Tách riêng khỏi Member vì Member model không có 2 trường này,
  // tránh việc mutate trực tiếp lên object member khiến các lần map sau bị undefined.
  booksHeld = signal<number>(0);
  /** Tổng tiền phạt đã ghi nhận */
  totalFines = signal<number>(0);
  /** Tổng tiền phạt đã thanh toán */
  totalPayments = signal<number>(0);
  /** Tiền phạt quá hạn chưa được ghi nhận */
  overdueFineAmount = signal<number>(0);

  private loadPatronMetrics(member: Member): void {
    const userId = member.user.id;
    const memberId = member.id;

    // Reset trước khi load để không hiển thị giá trị cũ của người khác
    this.booksHeld.set(0);
    this.totalFines.set(0);
    this.totalPayments.set(0);
    this.overdueFineAmount.set(0);

    this.borrowDetailService.getSummary(String(userId)).subscribe({
      next: (res) => {
        const sum = res.data;
        this.booksHeld.set((sum?.borrowing ?? 0) + (sum?.overdue ?? 0));
      },
      error: () => {
        this.booksHeld.set(0);
      },
    });

    // Load tổng tiền phạt đã ghi nhận
    this.fineService.getTotalByUserId(userId).subscribe({
      next: (total) => {
        this.totalFines.set(total ?? 0);
      },
      error: () => {
        this.totalFines.set(0);
      },
    });

    // Load tổng tiền phạt đã thanh toán
    this.finePaymentService.getTotalByUserId(userId).subscribe({
      next: (total) => {
        this.totalPayments.set(total ?? 0);
      },
      error: () => {
        this.totalPayments.set(0);
      },
    });

    // Load tiền phạt quá hạn chưa được ghi nhận
    this.borrowDetailService.getOverdueFine(memberId).subscribe({
      next: (amount) => {
        this.overdueFineAmount.set(amount ?? 0);
      },
      error: () => {
        this.overdueFineAmount.set(0);
      },
    });
  }

  // ===== Book selection =====
  isBookSelected(bookId: number): boolean {
    return this.selectedBooks.some((b) => b.id === bookId);
  }

  addBook(book: Book): void {
    // Tổng sách đang mượn + sách đang chọn trong phiếu không được vượt maxQuota từ setting
    if (this.booksHeld() + this.selectedBooks.length >= this.maxQuota || this.hasViolation) {
      return;
    }
    this.bookSelected.emit(book);
  }

  // ===== Display helpers =====
  formatPatronDisplay(member: Member): string {
    if (!member) return '';
    return `${member.memberCode} - ${member.user.fullName}`;
  }

  patronAvatarSrc(member: Member): string {
    return ImageUtils.toImageSrc(member?.user?.avatar, 'avatar-default.jpg');
  }

  patronCardStatus(member: Member | null): 'valid' | 'violation' | 'expired' {
    if (!member) return 'valid';
    const unpaidFines = this.unpaidFinesAmount();
    if (unpaidFines >= SettingService.getMaxFineBeforeBlock()) return 'violation';
    if (member.isExpired) return 'expired';
    return 'valid';
  }

  booksHeldValue(member: Member | null): number {
    if (!member) return 0;
    return this.booksHeld();
  }

  fineValue(member: Member | null): number {
    if (!member) return 0;
    return this.unpaidFinesAmount();
  }

  patronStatusLabel(member: Member): string {
    if (!member) return '';
    const unpaidFines = this.unpaidFinesAmount();
    if (this.patronCardStatus(member) === 'violation') {
      return `Thẻ khóa: Quá hạn nợ phạt (${this.formatCurrency(unpaidFines)})`;
    }
    if (this.patronCardStatus(member) === 'expired') {
      return `Thẻ hết hạn: ${this.formatCardExpiry(member)}`;
    }
    return `Thẻ hợp lệ - Còn hạn đến ${this.formatCardExpiry(member)}`;
  }

  /** Tiền phạt ghi nhận chưa nộp = tổng phạt - đã thanh toán */
  unpaidFinesAmount(): number {
    return Math.max(0, this.totalFines() - this.totalPayments());
  }

  /** Tiền phạt quá hạn chưa ghi */
  overdueFineValue(): number {
    return this.overdueFineAmount();
  }

  formatCardExpiry(member: Member): string {
    if (!member?.cardExpiry) return '';
    const d = new Date(member.cardExpiry);
    return TextUtils.formatDate(d, 'dd/MM/yyyy');
  }

  shelfDisplay(book: Book): string {
    if (!book?.shelf) return '';
    return `${book.shelf.code}${book.shelf.name ? ' - ' + book.shelf.name : ''}`;
  }

  authorsDisplay(book: Book): string {
    if (!book?.authors || book.authors.length === 0) return '';
    return book.authors.map((a) => a.name).join(', ');
  }

  categoryDisplay(book: Book): string {
    if (!book?.categories || book.categories.length === 0) return '';
    return book.categories.map((c) => c.name).join(', ');
  }

  coverSrc(book: Book): string {
    return ImageUtils.toImageSrc(book?.cover, 'book-default.jpg');
  }

  formatCurrency(amount: number): string {
    return TextUtils.toVnd(amount ?? 0);
  }
}
 