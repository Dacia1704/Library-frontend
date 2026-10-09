import { Component, inject, OnInit, signal } from '@angular/core';
import { ReaderBreadcrumbComponent } from './reader-breadcrumb/reader-breadcrumb';
import { ReaderHeaderComponent } from './reader-header/reader-header';
import { ReaderToolbarComponent } from './reader-toolbar/reader-toolbar';
import { ReaderTableComponent } from './reader-table/reader-table';
import { RegisterReaderModalComponent } from './register-reader-modal/register-reader-modal';
import { ViewReaderModalComponent } from './view-reader-modal/view-reader-modal';
import { EditReaderModalComponent } from './edit-reader-modal/edit-reader-modal';
import { SuccessToastComponent } from './success-toast/success-toast';
import { MemberService } from '@services/member.service';
import { Member } from '@model/member/member.model';
import { MemberFilter } from '@model/member/request/member-filter';

@Component({
  selector: 'app-reader-page',
  standalone: true,
  imports: [
    ReaderBreadcrumbComponent,
    ReaderHeaderComponent,
    ReaderToolbarComponent,
    ReaderTableComponent,
    RegisterReaderModalComponent,
    ViewReaderModalComponent,
    EditReaderModalComponent,
    SuccessToastComponent,
  ],
  templateUrl: './reader.html',
  styleUrls: ['./reader.scss'],
})
export class Reader implements OnInit {
  private memberService = inject(MemberService);

  // ===== State =====
  readonly members = signal<Member[]>([]);
  readonly totalElements = signal(0);
  readonly currentPage = signal(0);
  readonly pageSize = signal(10);
  readonly isLoading = signal(false);

  readonly filter = signal<MemberFilter>({});

  // Modal states
  readonly isRegisterModalOpen = signal(false);
  readonly isViewModalOpen = signal(false);
  readonly isEditModalOpen = signal(false);
  readonly selectedMember = signal<Member | null>(null);

  // Toast
  readonly isToastVisible = signal(false);
  readonly toastReaderName = signal('');

  ngOnInit(): void {
    this.loadMembers();
  }

  // ===== Data loading =====
  loadMembers(): void {
    this.isLoading.set(true);
    this.memberService.getPagination(this.filter(), this.currentPage(), this.pageSize())
      .subscribe({
        next: (res) => {
          if (res.code === 200) {
            this.members.set(res.data.data);
            this.totalElements.set(res.data.totalElements);
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
  }

  onFilterChange(filter: MemberFilter): void {
    this.filter.set(filter);
    this.currentPage.set(0);
    this.loadMembers();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadMembers();
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(0);
    this.loadMembers();
  }

  // ===== Modal: Register =====
  openRegisterModal(): void {
    this.isRegisterModalOpen.set(true);
  }

  closeRegisterModal(): void {
    this.isRegisterModalOpen.set(false);
  }

  onReaderCreated(name: string): void {
    this.isRegisterModalOpen.set(false);
    this.toastReaderName.set(name);
    this.isToastVisible.set(true);
    this.loadMembers();
  }

  // ===== Modal: View Detail =====
  openViewModal(member: Member): void {
    this.selectedMember.set(member);
    this.isViewModalOpen.set(true);
  }

  closeViewModal(): void {
    this.isViewModalOpen.set(false);
    this.selectedMember.set(null);
  }

  // ===== Modal: Edit =====
  openEditModal(member: Member): void {
    this.selectedMember.set(member);
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedMember.set(null);
  }

  onMemberUpdated(updated: Member): void {
    this.isEditModalOpen.set(false);
    this.selectedMember.set(null);
    this.loadMembers();
  }

  // ===== Toast =====
  closeToast(): void {
    this.isToastVisible.set(false);
  }

  // ===== Table actions =====
  onAction(event: { member: Member; action: string }): void {
    switch (event.action) {
      case 'view':
        this.openViewModal(event.member);
        break;
      case 'edit':
        this.openEditModal(event.member);
        break;
      default:
        console.log('reader action', event.action, event.member.user.fullName);
    }
  }
}
