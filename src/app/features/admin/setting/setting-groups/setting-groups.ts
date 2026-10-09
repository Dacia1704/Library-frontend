import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

interface SettingItem {
  key: string;
  label: string;
  code: string;
  description: string;
  value: string;
  unit: string;
  type: 'number' | 'text';
  min?: number;
  max?: number;
}

interface SettingGroup {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  paramCount: number;
  settings: SettingItem[];
}

@Component({
  selector: 'app-setting-groups',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './setting-groups.html',
  styleUrl: './setting-groups.scss',
})
export class SettingGroupsComponent {

  readonly groups: SettingGroup[] = [
    {
      id: 'fines',
      title: 'Mức phạt & Chế tài xử lý',
      description: 'Quy định mức thu tiền phạt quá hạn và bồi thường thiệt hại ấn phẩm tài liệu',
      icon: 'policy',
      iconColor: 'error',
      paramCount: 5,
      settings: [
        { key: 'FINE_OVERDUE_PER_DAY', label: 'Tiền phạt quá hạn mỗi ngày', code: 'FINE_OVERDUE_PER_DAY', description: 'Số tiền phạt lũy kế tính trên mỗi đầu sách cho mỗi ngày trả trễ quá hạn quy định của thư viện.', value: '5.000', unit: 'VNĐ / ngày', type: 'text' },
        { key: 'FINE_LOST_BOOK_RATE', label: 'Tỷ lệ phạt mất sách', code: 'FINE_LOST_BOOK_RATE', description: 'Tỷ lệ bồi hoàn theo giá trị niêm yết của ấn phẩm cộng chi phí xử lý nghiệp vụ lưu kho và phục vụ dán mã RFID.', value: '100', unit: '% giá bìa', type: 'number', min: 50, max: 300 },
        { key: 'FINE_DAMAGE_LIGHT_RATE', label: 'Tỷ lệ phạt hư nhẹ', code: 'FINE_DAMAGE_LIGHT_RATE', description: 'Áp dụng khi sách bị rách trang phụ lục, nhăn bìa góc, viết vẽ bút chì có thể tẩy xóa khôi phục.', value: '15', unit: '% giá bìa', type: 'number', min: 0, max: 100 },
        { key: 'FINE_DAMAGE_HEAVY_REPAIRABLE_RATE', label: 'Tỷ lệ phạt hư nặng (sửa được)', code: 'FINE_DAMAGE_HEAVY_REPAIRABLE_RATE', description: 'Áp dụng khi sách bong gáy, ẩm nước một phần, rách bìa chính cần đóng phục chế chuyên dụng từ bộ phận kỹ thuật.', value: '40', unit: '% giá bìa', type: 'number', min: 0, max: 100 },
        { key: 'FINE_DAMAGE_UNUSABLE_RATE', label: 'Tỷ lệ phạt hư nặng (không dùng được)', code: 'FINE_DAMAGE_UNUSABLE_RATE', description: 'Áp dụng khi sách mất trang nội dung chính, rách nát biến dạng không còn khả năng phục chế lưu hành.', value: '100', unit: '% giá bìa', type: 'number', min: 50, max: 200 },
      ],
    },
    {
      id: 'borrow',
      title: 'Quy định mượn trả & Luân chuyển',
      description: 'Thời hạn chu kỳ mượn, giới hạn ấn phẩm và ngưỡng kiểm soát tự động',
      icon: 'assignment_turned_in',
      iconColor: 'secondary',
      paramCount: 4,
      settings: [
        { key: 'BORROW_MAX_DAYS', label: 'Số ngày mượn tối đa', code: 'BORROW_MAX_DAYS', description: 'Thời hạn tối đa cho một chu kỳ mượn thông thường trước khi bắt đầu tính quá hạn phát sinh phạt.', value: '14', unit: 'ngày', type: 'number', min: 1, max: 90 },
        { key: 'BORROW_MAX_BOOKS', label: 'Số sách mượn tối đa mỗi lần', code: 'BORROW_MAX_BOOKS', description: 'Giới hạn số lượng tài liệu một độc giả được phép mượn đồng thời trên một thẻ thư viện hợp lệ.', value: '5', unit: 'cuốn', type: 'number', min: 1, max: 20 },
        { key: 'BORROW_MAX_DEBT_BLOCK', label: 'Mức nợ phạt tối đa trước khi bị khóa mượn', code: 'BORROW_MAX_DEBT_BLOCK', description: 'Nếu độc giả tích lũy tiền phạt chưa thanh toán vượt quá ngưỡng này, hệ thống sẽ tự động khóa quyền mượn sách mới.', value: '50.000', unit: 'VNĐ', type: 'text' },
        { key: 'BORROW_REMINDER_DAYS_BEFORE', label: 'Số ngày nhắc trước hạn trả', code: 'BORROW_REMINDER_DAYS_BEFORE', description: 'Hệ thống tự động kích hoạt gửi thông báo đẩy/email/SMS nhắc hẹn trả sách trước ngày hết hạn thực tế.', value: '3', unit: 'ngày', type: 'number', min: 1, max: 7 },
      ],
    },
    {
      id: 'membership',
      title: 'Thẻ thành viên & Biểu phí dịch vụ',
      description: 'Định mức lệ phí thành viên và các quyền lợi tra cứu dữ liệu số',
      icon: 'badge',
      iconColor: 'primary',
      paramCount: 1,
      settings: [
        { key: 'MEMBERSHIP_FEE_MONTHLY', label: 'Phí thành viên hàng tháng', code: 'MEMBERSHIP_FEE_MONTHLY', description: 'Mức thu phí duy trì quyền lợi thành viên định kỳ theo tháng để sử dụng dịch vụ thư viện, phòng đọc máy tính và mượn giáo trình học thuật.', value: '50.000', unit: 'VNĐ / tháng', type: 'text' },
      ],
    },
  ];

  saveSetting(groupId: string, settingKey: string, value: string): void {
    console.log('Saving:', groupId, settingKey, value);
  }
}
