import { Component } from '@angular/core';

interface QuickAction {
  icon: string;
  iconTone: 'primary' | 'secondary' | 'primary-fixed' | 'tertiary';
  title: string;
  description: string;
  ctaLabel: string;
  ctaTone: 'primary' | 'secondary' | 'tertiary';
}

@Component({
  selector: 'app-quick-action-cards',
  standalone: true,
  imports: [],
  templateUrl: './quick-action-cards.html',
  styleUrls: ['./quick-action-cards.scss'],
})
export class QuickActionCardsComponent {
  readonly cards: QuickAction[] = [
    {
      icon: 'person_add',
      iconTone: 'primary',
      title: 'Đăng ký độc giả mới',
      description: 'Mở tài khoản, cấp mã độc giả và phát hành phôi thẻ thư viện.',
      ctaLabel: 'Tạo hồ sơ mới',
      ctaTone: 'primary',
    },
    {
      icon: 'assignment_turned_in',
      iconTone: 'secondary',
      title: 'Lập phiếu mượn',
      description: 'Ghi nhận mượn sách tại quầy, kiểm tra hạn mức & quét mã vạch tài liệu.',
      ctaLabel: 'Tạo phiếu mượn',
      ctaTone: 'secondary',
    },
    {
      icon: 'move_to_inbox',
      iconTone: 'primary-fixed',
      title: 'Nhận trả sách',
      description: 'Kiểm tra tình trạng ấn phẩm hoàn trả, kiểm tra trễ hạn và hoàn kho.',
      ctaLabel: 'Tiếp nhận trả',
      ctaTone: 'primary',
    },
    {
      icon: 'receipt_long',
      iconTone: 'tertiary',
      title: 'Thu tiền phạt',
      description: 'Xử lý biên lai phạt nộp muộn, đền bù thất lạc hoặc hư hỏng tài liệu.',
      ctaLabel: 'Lập biên lai thu',
      ctaTone: 'tertiary',
    },
  ];
}