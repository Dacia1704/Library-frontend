import { Component, input, output } from '@angular/core';
import { Member } from '@model/member/member.model';
import { ImageUtils } from '@shared/utils/image-utils';
import { TextUtils } from '@shared/utils/text-utils';

export type ReaderAction =
  | 'view'
  | 'edit'
  | 'lock'
  | 'unlock'
  | 'create-card'
  | 'renew-card'
  | 'delete';

export interface ReaderActionEvent {
  member: Member;
  action: ReaderAction;
}

@Component({
  selector: 'app-reader-table',
  standalone: true,
  imports: [],
  templateUrl: './reader-table.html',
  styleUrls: ['./reader-table.scss'],
})
export class ReaderTableComponent {
  members = input.required<Member[]>();
  totalElements = input<number>(0);
  currentPage = input<number>(0);
  pageSize = input<number>(10);

  readonly action = output<ReaderActionEvent>();
  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  onAction(member: Member, action: ReaderAction): void {
    this.action.emit({ member, action });
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

  onPageSizeChange(size: number): void {
    this.pageSizeChange.emit(size);
  }

  getCreatedAt(member: Member): string {
    return TextUtils.formatDate(member.createdAt, 'dd/MM/yyyy');
  }

  get totalPages(): number {
    const total = this.totalElements();
    const size = this.pageSize();
    if (total === 0 || size === 0) return 1;
    return Math.ceil(total / size);
  }

  isCardExpired(member: Member): boolean {
    return member.cardExpiry && new Date(member.cardExpiry) < new Date();
  }


  avatarSrc(member: Member): string {
    const avatar = member.user.avatar;
    if (!avatar) {
      return 'avatar-default.jpg';
    }
    return ImageUtils.toImageSrc(avatar);
  }
}
