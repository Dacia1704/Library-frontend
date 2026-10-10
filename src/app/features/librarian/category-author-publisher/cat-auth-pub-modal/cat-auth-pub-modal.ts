import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '@model/category/category.model';
import { Author } from '@model/author/author.model';
import { Publisher } from '@model/publisher/publisher.model';
import { CategoryService } from '@services/category.service';
import { AuthorService } from '@services/author.service';
import { PublisherService } from '@services/publisher.service';
import { CategoryRequest } from '@model/category/request/category-request';
import { AuthorRequest } from '@model/author/request/author-request';
import { PublisherRequest } from '@model/publisher/request/publisher-request';
import { ToastService } from '@services/toast.service';

type ModalMode = 'create' | 'edit';
type ModalScope = 'category' | 'author' | 'publisher';

@Component({
  selector: 'app-cat-auth-pub-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cat-auth-pub-modal.html',
  styleUrls: ['./cat-auth-pub-modal.scss'],
})
export class CatAuthPubModalComponent implements OnChanges, AfterViewInit {
  private categoryService = inject(CategoryService);
  private authorService = inject(AuthorService);
  private publisherService = inject(PublisherService);
  private toastService = inject(ToastService);

  @ViewChild('categoryNameInput') categoryNameInput!: ElementRef<HTMLInputElement>;
  @ViewChild('authorNameInput') authorNameInput!: ElementRef<HTMLInputElement>;
  @ViewChild('publisherNameInput') publisherNameInput!: ElementRef<HTMLInputElement>;

  @Input() isOpen = false;
  @Input() mode: ModalMode = 'create';
  @Input() scope: ModalScope = 'category';
  @Input() category: Category | null = null;
  @Input() author: Author | null = null;
  @Input() publisher: Publisher | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  // Form fields
  categoryName = '';
  authorName = '';
  authorBio = '';
  publisherName = '';
  publisherAddress = '';

  isLoading = false;
  private shouldFocus = false;

  get modalTitle(): string {
    const action = this.mode === 'create' ? 'Thêm' : 'Chỉnh sửa';
    switch (this.scope) {
      case 'category':
        return this.mode === 'create' ? 'Thêm danh mục mới' : `Chỉnh sửa danh mục`;
      case 'author':
        return this.mode === 'create' ? 'Thêm hồ sơ tác giả' : `Chỉnh sửa tác giả`;
      case 'publisher':
        return this.mode === 'create' ? 'Thêm nhà xuất bản mới' : `Chỉnh sửa nhà xuất bản`;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category'] || changes['author'] || changes['publisher']) {
      this.populateForm();
    }
    if (changes['isOpen']) {
      this.shouldFocus = this.isOpen;
      if (this.isOpen) {
        this.populateForm();
      }
    }
  }

  ngAfterViewInit(): void {
    this.focusInputIfNeeded();
  }

  private focusInputIfNeeded(): void {
    if (!this.shouldFocus) return;
    this.shouldFocus = false;

    setTimeout(() => {
      switch (this.scope) {
        case 'category':
          this.categoryNameInput?.nativeElement.focus();
          break;
        case 'author':
          this.authorNameInput?.nativeElement.focus();
          break;
        case 'publisher':
          this.publisherNameInput?.nativeElement.focus();
          break;
      }
    }, 100);
  }

  private populateForm(): void {
    if (this.scope === 'category' && this.category) {
      this.categoryName = this.category.name;
    }
    if (this.scope === 'author' && this.author) {
      this.authorName = this.author.name;
      this.authorBio = this.author.bio || '';
    }
    if (this.scope === 'publisher' && this.publisher) {
      this.publisherName = this.publisher.name;
      this.publisherAddress = this.publisher.address || '';
    }
  }

  setScope(scope: ModalScope): void {
    this.scope = scope;
    this.populateForm();
    this.focusInputIfNeeded();
  }

  isValid(): boolean {
    switch (this.scope) {
      case 'category':
        return !!this.categoryName.trim();
      case 'author':
        return !!this.authorName.trim() && !!this.authorBio.trim();
      case 'publisher':
        return !!this.publisherName.trim() && !!this.publisherAddress.trim();
    }
  }

  onSubmit(): void {
    if (!this.isValid()) return;

    this.isLoading = true;

    switch (this.scope) {
      case 'category':
        this.submitCategory();
        break;
      case 'author':
        this.submitAuthor();
        break;
      case 'publisher':
        this.submitPublisher();
        break;
    }
  }

  private submitCategory(): void {
    const data: CategoryRequest = { name: this.categoryName.trim() };
    const request$ = this.mode === 'create'
      ? this.categoryService.create(data)
      : this.categoryService.update(this.category!.id, data);

    request$.subscribe({
      next: () => {
        this.toastService.success(
          this.mode === 'create' ? 'Đã thêm danh mục mới' : 'Đã cập nhật danh mục'
        );
        this.isLoading = false;
        this.resetForm();
        this.saved.emit();
        this.close.emit();
      },
      error: (error) => {
        this.toastService.error(error?.error?.message || 'Đã xảy ra lỗi');
        this.isLoading = false;
      }
    });
  }

  private submitAuthor(): void {
    const data: AuthorRequest = { name: this.authorName.trim(), bio: this.authorBio.trim() };
    const request$ = this.mode === 'create'
      ? this.authorService.create(data)
      : this.authorService.update(this.author!.id, data);

    request$.subscribe({
      next: () => {
        this.toastService.success(
          this.mode === 'create' ? 'Đã thêm tác giả mới' : 'Đã cập nhật tác giả'
        );
        this.isLoading = false;
        this.resetForm();
        this.saved.emit();
        this.close.emit();
      },
      error: (error) => {
        this.toastService.error(error?.error?.message || 'Đã xảy ra lỗi');
        this.isLoading = false;
      }
    });
  }

  private submitPublisher(): void {
    const data: PublisherRequest = { name: this.publisherName.trim(), address: this.publisherAddress.trim() };
    const request$ = this.mode === 'create'
      ? this.publisherService.create(data)
      : this.publisherService.update(this.publisher!.id, data);

    request$.subscribe({
      next: () => {
        this.toastService.success(
          this.mode === 'create' ? 'Đã thêm nhà xuất bản mới' : 'Đã cập nhật nhà xuất bản'
        );
        this.isLoading = false;
        this.resetForm();
        this.saved.emit();
        this.close.emit();
      },
      error: (error) => {
        this.toastService.error(error?.error?.message || 'Đã xảy ra lỗi');
        this.isLoading = false;
      }
    });
  }

  onClose(): void {
    this.resetForm();
    this.close.emit();
  }

  onOverlayClick(event: Event): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose();
    }
  }

  private resetForm(): void {
    this.categoryName = '';
    this.authorName = '';
    this.authorBio = '';
    this.publisherName = '';
    this.publisherAddress = '';
  }
}
