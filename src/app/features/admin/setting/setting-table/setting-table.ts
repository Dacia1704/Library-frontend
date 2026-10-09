import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ConfigRow {
  key: string;
  value: string;
  description: string;
  updatedAt: string;
  updatedBy: string;
  icon: string;
  iconColor: string;
}

@Component({
  selector: 'app-setting-table',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './setting-table.html',
  styleUrl: './setting-table.scss',
})
export class SettingTableComponent {

  readonly configs: ConfigRow[] = [
    {
      key: 'FINE_OVERDUE_PER_DAY',
      value: '5000',
      description: 'Số tiền phạt lũy kế tính trên mỗi đầu sách cho mỗi ngày trả trễ quá hạn.',
      updatedAt: '10:30 26/02/2025',
      updatedBy: 'Lê Hoàng Long',
      icon: 'gavel',
      iconColor: 'error',
    },
    {
      key: 'FINE_LOST_BOOK_RATE',
      value: '100%',
      description: 'Tỷ lệ bồi hoàn theo giá niêm yết của ấn phẩm cộng chi phí xử lý nghiệp vụ.',
      updatedAt: '08:15 25/02/2025',
      updatedBy: 'Lê Hoàng Long',
      icon: 'gavel',
      iconColor: 'error',
    },
    {
      key: 'BORROW_MAX_DAYS',
      value: '14',
      description: 'Thời hạn tối đa cho một lượt mượn tài liệu trước khi tính quá hạn.',
      updatedAt: '14:00 24/02/2025',
      updatedBy: 'Lê Hoàng Long',
      icon: 'schedule',
      iconColor: 'secondary',
    },
    {
      key: 'BORROW_MAX_BOOKS',
      value: '5',
      description: 'Số lượng ấn phẩm tối đa được phép mượn đồng thời trên một tài khoản độc giả.',
      updatedAt: '09:20 22/02/2025',
      updatedBy: 'Lê Hoàng Long',
      icon: 'book',
      iconColor: 'secondary',
    },
    {
      key: 'MEMBERSHIP_FEE_MONTHLY',
      value: '50000',
      description: 'Mức thu phí duy trì quyền lợi độc giả định kỳ theo tháng để mượn giáo trình và sử dụng phòng đọc.',
      updatedAt: '16:45 20/02/2025',
      updatedBy: 'Lê Hoàng Long',
      icon: 'monetization_on',
      iconColor: 'tertiary',
    },
    {
      key: 'APP_SYSTEM_NAME',
      value: 'Thư Viện Trí Tuệ',
      description: 'Tên hiển thị thương hiệu chính thức trên cổng Web OPAC và tiêu đề phiếu in nhiệt.',
      updatedAt: '11:10 18/02/2025',
      updatedBy: 'Lê Hoàng Long',
      icon: 'title',
      iconColor: 'primary',
    },
    {
      key: 'SECURITY_SESSION_TIMEOUT',
      value: '120 (phút)',
      description: 'Thời gian nhàn rỗi tối đa trước khi tự động đăng xuất phiên làm việc của thủ thư.',
      updatedAt: '17:00 15/02/2025',
      updatedBy: 'Lê Hoàng Long',
      icon: 'lock_clock',
      iconColor: 'tertiary',
    },
  ];

  searchTerm = '';

  get filteredConfigs(): ConfigRow[] {
    if (!this.searchTerm) return this.configs;
    const term = this.searchTerm.toLowerCase();
    return this.configs.filter(c => 
      c.key.toLowerCase().includes(term) || 
      c.description.toLowerCase().includes(term)
    );
  }
}
