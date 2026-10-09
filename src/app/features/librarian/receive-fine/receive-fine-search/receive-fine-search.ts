import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

import { Member } from '@model/member/member.model';
import { MemberService } from '@core/services/member.service';
import { ImageUtils } from '@shared/utils/image-utils';

@Component({
  selector: 'app-receive-fine-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './receive-fine-search.html',
  styleUrls: ['./receive-fine-search.scss'],
})
export class ReceiveFineSearchComponent implements OnInit, OnDestroy {
  @Input() selectedMember: Member | null = null;
  @Output() memberChange = new EventEmitter<Member>();

  private readonly memberService = inject(MemberService);

  // Search state
  searchQuery = '';
  searchResults = signal<Member[]>([]);
  isOpen = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  
  private readonly searchSubject$ = new Subject<string>();
  private searchSub?: Subscription;

  ngOnInit(): void {
    this.setupSearch();
    // Initial load
    this.searchSubject$.next('');
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  private setupSearch(): void {
    this.searchSub = this.searchSubject$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((kw) => {
          this.isLoading.set(true);
          if (kw && kw.trim().length > 0) {
            return this.memberService.getMembers(kw.trim());
          }
          // No keyword → first page, 10 records
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
          this.searchResults.set(list);
          this.isLoading.set(false);
          this.isOpen.set(true);
        },
        error: () => {
          this.searchResults.set([]);
          this.isLoading.set(false);
        },
      });
  }

  onSearchInput(value: string): void {
    this.searchQuery = value;
    this.searchSubject$.next(value);
  }

  onFocus(): void {
    if (this.searchResults().length > 0) {
      this.isOpen.set(true);
    }
  }

  onBlur(): void {
    // Close dropdown after a short delay so click event on item can fire
    setTimeout(() => this.isOpen.set(false), 150);
  }

  selectMember(member: Member): void {
    this.searchQuery = this.formatMemberDisplay(member);
    this.isOpen.set(false);
    this.memberChange.emit(member);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults.set([]);
    this.isOpen.set(false);
  }

  private formatMemberDisplay(member: Member): string {
    if (!member) return '';
    return `${member.memberCode} - ${member.user.fullName}`;
  }

  avatarSrc(member: Member): string {
    return ImageUtils.toImageSrc(member?.user?.avatar, 'avatar-default.jpg');
  }
}
