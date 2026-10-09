import { Component, computed, input, output } from '@angular/core';
import { Member } from '@model/member/member.model';
import { ImageUtils } from '@shared/utils/image-utils';

@Component({
  selector: 'app-view-reader-modal',
  standalone: true,
  imports: [],
  templateUrl: './view-reader-modal.html',
  styleUrls: ['./view-reader-modal.scss'],
})
export class ViewReaderModalComponent {
  isOpen = input<boolean>(false);
  member = input<Member | null>(null);
  readonly closed = output<void>();

  readonly avatarSrc = computed(() => {
    const avatar = this.member()?.user.avatar;
    if (!avatar) {
      return 'avatar-default.jpg';
    }
    return ImageUtils.toImageSrc(avatar);
  });

  close(): void {
    this.closed.emit();
  }

  getCardStatusLabel(status: string): string {
    switch (status) {
      case 'ISSUED': return 'Đã phát hành';
      case 'PENDING': return 'Chờ phát hành';
      default: return status;
    }
  }

  formatDate(date: Date | string): string {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('vi-VN');
  }
}
