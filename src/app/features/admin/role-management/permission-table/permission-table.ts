import { Component } from '@angular/core';
import { NgClass, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-permission-table',
  standalone: true,
  imports: [NgClass, DecimalPipe],
  templateUrl: './permission-table.html',
  styleUrl: './permission-table.scss',
})
export class PermissionTableComponent {

  readonly permissions = [
    {
      id: 1,
      code: 'USER_LOCK',
      name: 'Khóa & Kích hoạt tài khoản',
      category: 'Người dùng & Tài khoản',
      description: 'Cho phép đình chỉ quyền truy cập của người dùng hoặc mở khóa lại.',
      riskLevel: 'Cao / Nguy hiểm',
      riskClass: 'risk-high',
    },
    {
      id: 2,
      code: 'BOOK_WRITE',
      name: 'Nhập & Sửa dữ liệu ấn phẩm',
      category: 'Sách & Kho ấn phẩm',
      description: 'Tạo mới đầu sách, cấp số kiểm kê và cập nhật thông tin vị trí lưu trữ.',
      riskLevel: 'Trung bình',
      riskClass: 'risk-medium',
    },
    {
      id: 3,
      code: 'BORROW_RETURN',
      name: 'Nhận trả & Hoàn tất mượn',
      category: 'Mượn trả lưu thông',
      description: 'Quét mã vạch nhận trả sách, cập nhật số lượng tồn kho tự động.',
      riskLevel: 'Thấp / Thường nhật',
      riskClass: 'risk-low',
    },
    {
      id: 4,
      code: 'SYSTEM_BACKUP',
      name: 'Sao lưu & Phục hồi dữ liệu',
      category: 'Cấu hình & Hệ thống',
      description: 'Tải bản sao lưu CSDL SQL, kích hoạt quy trình rollback thảm họa.',
      riskLevel: 'Rất cao',
      riskClass: 'risk-high',
    },
  ];
}
