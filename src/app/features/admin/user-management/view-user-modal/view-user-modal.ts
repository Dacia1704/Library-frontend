import { Component, computed, input, output } from '@angular/core';
import { User } from '@model/user/user.model';
import { ImageUtils } from '@shared/utils/image-utils';

@Component({
  selector: 'app-view-user-modal',
  standalone: true,
  imports: [],
  templateUrl: './view-user-modal.html',
  styleUrl: './view-user-modal.scss',
})
export class ViewUserModalComponent {
  isOpen = input<boolean>(false);
  user = input<User | null>(null);
  readonly closed = output<void>();
  readonly editUser = output<User>();

  readonly avatarSrc = computed(() => {
    return ImageUtils.toImageSrc(this.user()?.avatar, 'avatar-default.jpg');
  });

  close(): void {
    this.closed.emit();
  }

  onEdit(): void {
    this.editUser.emit(this.user()!);
  }

  getCardStatusLabel(status: string): string {
    switch (status) {
      case 'ISSUED': return 'Đã cấp';
      case 'PENDING': return 'Chờ cấp';
      default: return status;
    }
  }

  getRoleLabel(roleName: string): string {
    const role = roleName?.toLowerCase() || '';
    if (role.includes('admin')) return 'Quản trị viên';
    if (role.includes('librarian')) return 'Thủ thư';
    if (role.includes('reader')) return 'Độc giả';
    if (role.includes('member')) return 'Thành viên';
    return roleName;
  }

  formatDate(date: Date | string): string {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('vi-VN');
  }

  isCardExpired(): boolean {
    const member = this.user()?.member;
    if (!member) return false;
    return new Date(member.cardExpiry) < new Date();
  }
}
