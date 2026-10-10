import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryService } from '@core/services/category.service';
import { AuthorService } from '@core/services/author.service';
import { PublisherService } from '@core/services/publisher.service';
import { ToastService } from '@core/services/toast.service';

import { Category } from '@model/category/category.model';
import { Author } from '@model/author/author.model';
import { Publisher } from '@model/publisher/publisher.model';

import { CategoryRequest } from '@model/category/request/category-request';
import { AuthorRequest } from '@model/author/request/author-request';
import { PublisherRequest } from '@model/publisher/request/publisher-request';

import { CatAuthPubBreadcrumbComponent } from './cat-auth-pub-breadcrumb/cat-auth-pub-breadcrumb';
import { CatAuthPubHeaderComponent } from './cat-auth-pub-header/cat-auth-pub-header';
import { CatAuthPubTabsComponent } from './cat-auth-pub-tabs/cat-auth-pub-tabs';
import { CatAuthPubToolbarComponent } from './cat-auth-pub-toolbar/cat-auth-pub-toolbar';
import { CatAuthPubCategoryTableComponent } from './cat-auth-pub-category-table/cat-auth-pub-category-table';
import { CatAuthPubAuthorGridComponent } from './cat-auth-pub-author-grid/cat-auth-pub-author-grid';
import { CatAuthPubPublisherGridComponent } from './cat-auth-pub-publisher-grid/cat-auth-pub-publisher-grid';
import { CatAuthPubPaginationComponent } from './cat-auth-pub-pagination/cat-auth-pub-pagination';
import { CatAuthPubHelperCardComponent } from './cat-auth-pub-helper-card/cat-auth-pub-helper-card';
import { CatAuthPubModalComponent } from './cat-auth-pub-modal/cat-auth-pub-modal';

type TabKey = 'categories' | 'authors' | 'publishers';
type ModalMode = 'create' | 'edit';
type ModalScope = 'category' | 'author' | 'publisher';

interface Stats {
  categoryCount: number;
  authorCount: number;
  publisherCount: number;
  deletedCount: number;
}

interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

@Component({
  selector: 'app-category-author-publisher',
  standalone: true,
  imports: [
    CommonModule,
    CatAuthPubBreadcrumbComponent,
    CatAuthPubHeaderComponent,
    CatAuthPubTabsComponent,
    CatAuthPubToolbarComponent,
    CatAuthPubCategoryTableComponent,
    CatAuthPubAuthorGridComponent,
    CatAuthPubPublisherGridComponent,
    CatAuthPubPaginationComponent,
    CatAuthPubHelperCardComponent,
    CatAuthPubModalComponent,
  ],
  templateUrl: './category-author-publisher.html',
  styleUrls: ['./category-author-publisher.scss'],
})
export class CategoryAuthorPublisherPage implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly authorService = inject(AuthorService);
  private readonly publisherService = inject(PublisherService);
  private readonly toast = inject(ToastService);

  // Tab state
  activeTab = signal<TabKey>('categories');
  searchKeyword = signal('');

  // Data signals
  categories = signal<Category[]>([]);
  authors = signal<Author[]>([]);
  publishers = signal<Publisher[]>([]);

  // Loading signal
  loading = signal(false);

  // Stats signal
  stats = signal<Stats>({
    categoryCount: 0,
    authorCount: 0,
    publisherCount: 0,
    deletedCount: 0,
  });

  // Pagination signal (chỉ dùng cho authors/publishers)
  pagination = signal<Pagination>({
    page: 0,
    size: 12,
    totalElements: 0,
    totalPages: 0,
  });

  // Deleted toggle
  showDeleted = signal(true);

  // Modal state signals
  isModalOpen = signal(false);
  modalMode = signal<ModalMode>('create');
  modalScope = signal<ModalScope>('category');
  editingCategory = signal<Category | null>(null);
  editingAuthor = signal<Author | null>(null);
  editingPublisher = signal<Publisher | null>(null);

  // Computed values
  tabCounts = computed(() => ({
    categories: this.stats().categoryCount,
    authors: this.stats().authorCount,
    publishers: this.stats().publisherCount,
  }));

  searchPlaceholder = computed(() => {
    switch (this.activeTab()) {
      case 'categories':
        return 'Tìm kiếm theo tên danh mục...';
      case 'authors':
        return 'Tìm kiếm theo tên tác giả...';
      case 'publishers':
        return 'Tìm kiếm theo tên nhà xuất bản...';
    }
  });

  // Filtered categories (no pagination, just search)
  filteredCategories = computed(() => {
    const keyword = this.searchKeyword().toLowerCase().trim();
    const cats = this.categories();
    
    if (!keyword) return cats;
    return cats.filter(c => c.name.toLowerCase().includes(keyword));
  });

  ngOnInit(): void {
    this.loadAllStats();
    this.loadCurrentTabData();
  }

  private loadAllStats(): void {
    // Load category count
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.stats.update(s => ({ ...s, categoryCount: res.data?.length ?? 0 }));
      },
    });

    // Load author count
    this.authorService.getAuthors().subscribe({
      next: (res) => {
        this.stats.update(s => ({ ...s, authorCount: res.data?.length ?? 0 }));
      },
    });

    // Load publisher count
    this.publisherService.getPublishers().subscribe({
      next: (res) => {
        this.stats.update(s => ({ ...s, publisherCount: res.data?.length ?? 0 }));
      },
    });
  }

  loadCurrentTabData(): void {
    this.loading.set(true);
    switch (this.activeTab()) {
      case 'categories':
        this.loadCategories();
        break;
      case 'authors':
        this.loadAuthors();
        break;
      case 'publishers':
        this.loadPublishers();
        break;
    }
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Không thể tải danh mục');
        this.loading.set(false);
      },
    });
  }

  private loadAuthors(): void {
    this.authorService.getPagination(this.searchKeyword(), this.pagination().page, this.pagination().size).subscribe({
      next: (res) => {
        this.authors.set(res.data?.data ?? []);
        this.pagination.set({
          ...this.pagination(),
          totalElements: res.data?.totalElements ?? 0,
          totalPages: res.data?.totalPages ?? 0,
        });
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Không thể tải danh sách tác giả');
        this.loading.set(false);
      },
    });
  }

  private loadPublishers(): void {
    this.publisherService.getPagination(this.searchKeyword(), this.pagination().page, this.pagination().size).subscribe({
      next: (res) => {
        this.publishers.set(res.data?.data ?? []);
        this.pagination.set({
          ...this.pagination(),
          totalElements: res.data?.totalElements ?? 0,
          totalPages: res.data?.totalPages ?? 0,
        });
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Không thể tải danh sách nhà xuất bản');
        this.loading.set(false);
      },
    });
  }

  // Tab actions
  onTabChange(tab: TabKey): void {
    this.activeTab.set(tab);
    this.pagination.update(p => ({ ...p, page: 0 }));
    this.loadCurrentTabData();
  }

  // Search
  onSearch(keyword: string): void {
    this.searchKeyword.set(keyword);
    this.pagination.update(p => ({ ...p, page: 0 }));
    this.loadCurrentTabData();
  }

  // Filter
  onStatusFilter(status: string): void {
    console.log('Status filter:', status);
  }

  // Toggle deleted
  onToggleDeleted(show: boolean): void {
    this.showDeleted.set(show);
  }

  // Refresh
  onRefresh(): void {
    this.loadAllStats();
    this.loadCurrentTabData();
  }

  // Pagination
  onPageChange(page: number): void {
    this.pagination.update(p => ({ ...p, page }));
    this.loadCurrentTabData();
  }

  onSizeChange(size: number): void {
    this.pagination.update(p => ({ ...p, size, page: 0 }));
    this.loadCurrentTabData();
  }

  // Export
  onExport(): void {
    console.log('Export data');
    this.toast.info('Đang xuất dữ liệu...');
  }

  // Create
  onCreate(): void {
    this.modalMode.set('create');
    this.modalScope.set(this.activeTab() as ModalScope);
    this.editingCategory.set(null);
    this.editingAuthor.set(null);
    this.editingPublisher.set(null);
    this.isModalOpen.set(true);
  }

  // Category CRUD
  onEditCategory(category: Category): void {
    this.modalMode.set('edit');
    this.modalScope.set('category');
    this.editingCategory.set(category);
    this.isModalOpen.set(true);
  }

  onDeleteCategory(category: Category): void {
    if (!confirm(`Xóa danh mục "${category.name}"?`)) return;

    this.categoryService.delete(category.id).subscribe({
      next: () => {
        this.toast.success('Xóa danh mục thành công');
        this.loadCategories();
      },
      error: () => {
        this.toast.error('Không thể xóa danh mục');
      },
    });
  }

  onRestoreCategory(category: Category): void {
    this.categoryService.restore(category.id, { name: category.name }).subscribe({
      next: () => {
        this.toast.success('Khôi phục danh mục thành công');
        this.loadCategories();
      },
      error: () => {
        this.toast.error('Không thể khôi phục danh mục');
      },
    });
  }

  onPermanentDeleteCategory(category: Category): void {
    if (!confirm(`Xóa vĩnh viễn danh mục "${category.name}"?`)) return;
    console.log('Permanent delete:', category);
  }

  // Author CRUD
  onEditAuthor(author: Author): void {
    this.modalMode.set('edit');
    this.modalScope.set('author');
    this.editingAuthor.set(author);
    this.isModalOpen.set(true);
  }

  onDeleteAuthor(author: Author): void {
    if (!confirm(`Xóa tác giả "${author.name}"?`)) return;

    this.authorService.delete(author.id).subscribe({
      next: () => {
        this.toast.success('Xóa tác giả thành công');
        this.loadAuthors();
      },
      error: () => {
        this.toast.error('Không thể xóa tác giả');
      },
    });
  }

  // Publisher CRUD
  onEditPublisher(publisher: Publisher): void {
    this.modalMode.set('edit');
    this.modalScope.set('publisher');
    this.editingPublisher.set(publisher);
    this.isModalOpen.set(true);
  }

  onDeletePublisher(publisher: Publisher): void {
    if (!confirm(`Xóa nhà xuất bản "${publisher.name}"?`)) return;

    this.publisherService.delete(publisher.id).subscribe({
      next: () => {
        this.toast.success('Xóa nhà xuất bản thành công');
        this.loadPublishers();
      },
      error: () => {
        this.toast.error('Không thể xóa nhà xuất bản');
      },
    });
  }

  // Modal
  onCloseModal(): void {
    this.isModalOpen.set(false);
  }

  onSave(data: any): void {
    switch (this.modalScope()) {
      case 'category':
        this.saveCategory(data);
        break;
      case 'author':
        this.saveAuthor(data);
        break;
      case 'publisher':
        this.savePublisher(data);
        break;
    }
  }

  private saveCategory(data: CategoryRequest): void {
    if (this.modalMode() === 'create') {
      this.categoryService.create(data).subscribe({
        next: () => {
          this.toast.success('Thêm danh mục thành công');
          this.closeModalAndReload();
        },
        error: () => {
          this.toast.error('Không thể thêm danh mục');
        },
      });
    } else if (this.editingCategory()) {
      this.categoryService.update(this.editingCategory()!.id, data).subscribe({
        next: () => {
          this.toast.success('Cập nhật danh mục thành công');
          this.closeModalAndReload();
        },
        error: () => {
          this.toast.error('Không thể cập nhật danh mục');
        },
      });
    }
  }

  private saveAuthor(data: AuthorRequest): void {
    if (this.modalMode() === 'create') {
      this.authorService.create(data).subscribe({
        next: () => {
          this.toast.success('Thêm tác giả thành công');
          this.closeModalAndReload();
        },
        error: () => {
          this.toast.error('Không thể thêm tác giả');
        },
      });
    } else if (this.editingAuthor()) {
      this.authorService.update(this.editingAuthor()!.id, data).subscribe({
        next: () => {
          this.toast.success('Cập nhật tác giả thành công');
          this.closeModalAndReload();
        },
        error: () => {
          this.toast.error('Không thể cập nhật tác giả');
        },
      });
    }
  }

  private savePublisher(data: PublisherRequest): void {
    if (this.modalMode() === 'create') {
      this.publisherService.create(data).subscribe({
        next: () => {
          this.toast.success('Thêm nhà xuất bản thành công');
          this.closeModalAndReload();
        },
        error: () => {
          this.toast.error('Không thể thêm nhà xuất bản');
        },
      });
    } else if (this.editingPublisher()) {
      this.publisherService.update(this.editingPublisher()!.id, data).subscribe({
        next: () => {
          this.toast.success('Cập nhật nhà xuất bản thành công');
          this.closeModalAndReload();
        },
        error: () => {
          this.toast.error('Không thể cập nhật nhà xuất bản');
        },
      });
    }
  }

  private closeModalAndReload(): void {
    this.isModalOpen.set(false);
    this.loadAllStats();
    this.loadCurrentTabData();
  }
}
