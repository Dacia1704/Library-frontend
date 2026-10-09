import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UserItem {
  id: number;
  fullName: string;
  username: string;
  email: string;
  citizenId: string;
  memberCode: string | null;
  role: 'admin' | 'librarian' | 'reader';
  roleLabel: string;
  isActive: boolean;
  isLocked?: boolean;
  lockReason?: string;
  hasCard?: boolean;
  avatarInitials: string;
  avatarColor: 'primary' | 'secondary' | 'default' | 'error';
  phone: string;
  createdDate: string;
}

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './user-table.html',
  styleUrl: './user-table.scss',
})
export class UserTableComponent {

  readonly users: UserItem[] = [
    {
      id: 1,
      fullName: 'Lê Hoàng Long',
      username: '@long.le',
      email: 'hoanglong.le@thuvientritue.vn',
      citizenId: '001200004921',
      memberCode: 'MBR-ADM-001',
      role: 'admin',
      roleLabel: 'Quản trị viên',
      isActive: true,
      avatarInitials: 'HL',
      avatarColor: 'primary',
      phone: '0912 888 999',
      createdDate: '12/01/2024',
    },
    {
      id: 2,
      fullName: 'Trần Thị Hương',
      username: '@huong.tran',
      email: 'huong.tran@thuvientritue.vn',
      citizenId: '031195008732',
      memberCode: 'MBR-LIB-012',
      role: 'librarian',
      roleLabel: 'Thủ thư',
      isActive: true,
      avatarInitials: 'TH',
      avatarColor: 'secondary',
      phone: '0987 654 321',
      createdDate: '04/02/2024',
    },
    {
      id: 3,
      fullName: 'Nguyễn Văn An',
      username: '@an.nguyen',
      email: 'an.nguyen@email.vn',
      citizenId: '001201019823',
      memberCode: 'MBR-2025-012',
      role: 'reader',
      roleLabel: 'Độc giả',
      isActive: true,
      avatarInitials: 'NA',
      avatarColor: 'default',
      phone: '0903 112 233',
      createdDate: '15/03/2024',
    },
    {
      id: 4,
      fullName: 'Vũ Minh Tuấn',
      username: '@tuan.vm',
      email: 'tuan.vu@domain.com',
      citizenId: '026099001423',
      memberCode: 'MBR-2024-889',
      role: 'reader',
      roleLabel: 'Độc giả',
      isActive: false,
      isLocked: true,
      lockReason: 'Khóa vi phạm: Mượn quá hạn 60 ngày',
      avatarInitials: 'VT',
      avatarColor: 'error',
      phone: '0901 234 567',
      createdDate: '20/01/2024',
    },
    {
      id: 5,
      fullName: 'Phạm Khánh Linh',
      username: '@linh.pk',
      email: 'khanhlinh.pham@gmail.com',
      citizenId: '038202009118',
      memberCode: null,
      role: 'reader',
      roleLabel: 'Độc giả',
      isActive: true,
      hasCard: false,
      avatarInitials: 'PL',
      avatarColor: 'default',
      phone: '0945 999 111',
      createdDate: '22/03/2024',
    },
  ];

  readonly pageSizeOptions = [10, 20, 50, 100];
  currentPage = 1;
  pageSize = 20;
  totalUsers = 1248;

  get totalPages(): number {
    return Math.ceil(this.totalUsers / this.pageSize);
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push(-1);
      
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (current < total - 2) pages.push(-1);
      pages.push(total);
    }
    
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  viewUser(user: UserItem): void {
    console.log('View user:', user);
  }

  editUser(user: UserItem): void {
    console.log('Edit user:', user);
  }

  deleteUser(user: UserItem): void {
    console.log('Delete user:', user);
  }

  toggleUserStatus(user: UserItem): void {
    user.isActive = !user.isActive;
  }
}
