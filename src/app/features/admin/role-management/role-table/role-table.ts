import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-role-table',
  standalone: true,
  imports: [NgClass],
  templateUrl: './role-table.html',
  styleUrl: './role-table.scss',
})
export class RoleTableComponent {

  readonly roles = [
    {
      id: 1,
      name: 'Quản trị viên cấp cao',
      nameSub: 'Super Administrator • Root Level',
      code: 'ROLE_SUPER_ADMIN',
      description: 'Toàn quyền kiểm soát hệ sinh thái, cấu hình tham số cốt lõi, sao lưu CSDL và phân quyền quản trị.',
      permissionCount: 32,
      permissionPercent: 100,
      userCount: 2,
      isSystem: true,
      icon: 'shield',
      iconColor: 'primary',
    },
    {
      id: 2,
      name: 'Thủ thư ca trưởng',
      nameSub: 'Trưởng ca vận hành lưu thông & kho ấn phẩm',
      code: 'ROLE_HEAD_LIBRARIAN',
      description: 'Phụ trách điều phối ca trực, xử lý mượn trả đặc thù, duyệt miễn phạt và quản lý kho sách chuyên sâu.',
      permissionCount: 24,
      permissionPercent: 75,
      userCount: 4,
      isEditing: true,
      icon: 'local_library',
      iconColor: 'secondary',
    },
    {
      id: 3,
      name: 'Thủ thư nghiệp vụ',
      nameSub: 'Lễ tân quầy lưu thông, mượn trả & xếp giá sách',
      code: 'ROLE_LIBRARIAN',
      description: 'Lập phiếu mượn, nhận trả sách thường nhật, thu tiền phạt theo quy định và kiểm kê ấn phẩm theo kệ.',
      permissionCount: 18,
      permissionPercent: 56.2,
      userCount: 8,
      icon: 'book',
      iconColor: 'default',
    },
    {
      id: 4,
      name: 'Cộng tác viên số hóa',
      nameSub: 'Tổ biên mục, nhập liệu E-book & chụp quét tài liệu',
      code: 'ROLE_DIGITAL_STAFF',
      description: 'Nhập mới siêu dữ liệu sách, bổ sung tác giả/NXB, tải lên tệp đính kèm và kiểm duyệt tài liệu số.',
      permissionCount: 9,
      permissionPercent: 28.1,
      userCount: 2,
      icon: 'auto_stories',
      iconColor: 'default',
    },
    {
      id: 5,
      name: 'Độc giả tiêu chuẩn',
      nameSub: 'Sinh viên, giảng viên và bạn đọc có thẻ hợp lệ',
      code: 'ROLE_READER',
      description: 'Tra cứu tài liệu trực tuyến (OPAC), đặt mượn trước sách, xem lịch sử cá nhân và gia hạn sách tự động.',
      permissionCount: 4,
      permissionPercent: 12.5,
      userCount: 1232,
      isDefault: true,
      icon: 'school',
      iconColor: 'default',
    },
  ];

  viewPermissions(role: any): void {
    console.log('View permissions:', role);
  }

  editRole(role: any): void {
    console.log('Edit role:', role);
  }

  deleteRole(role: any): void {
    console.log('Delete role:', role);
  }
}
