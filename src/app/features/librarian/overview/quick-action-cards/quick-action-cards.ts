import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface QuickAction {
  icon: string;
  iconTone: 'primary' | 'secondary' | 'primary-fixed' | 'tertiary';
  title: string;
  description: string;
  ctaLabel: string;
  ctaTone: 'primary' | 'secondary' | 'tertiary';
  route: string;
  queryParams?: Record<string, string>;
}

@Component({
  selector: 'app-quick-action-cards',
  standalone: true,
  imports: [RouterLink],
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
      route: '/librarian/readers',
    },
    {
      icon: 'assignment_turned_in',
      iconTone: 'secondary',
      title: 'Lập phiếu mượn',
      description: 'Ghi nhận mượn sách tại quầy, kiểm tra hạn mức & quét mã vạch tài liệu.',
      ctaLabel: 'Tạo phiếu mượn',
      ctaTone: 'secondary',
      route: '/librarian/borrow-records/create',
    },
    {
      icon: 'move_to_inbox',
      iconTone: 'primary-fixed',
      title: 'Nhận trả sách',
      description: 'Kiểm tra tình trạng ấn phẩm hoàn trả, kiểm tra trễ hạn và hoàn kho.',
      ctaLabel: 'Tiếp nhận trả',
      ctaTone: 'primary',
      route: '/librarian/borrow-records',
    },
    {
      icon: 'receipt_long',
      iconTone: 'tertiary',
      title: 'Thu tiền phạt',
      description: 'Xử lý biên lai phạt nộp muộn, đền bù thất lạc hoặc hư hỏng tài liệu.',
      ctaLabel: 'Lập biên lai thu',
      ctaTone: 'tertiary',
      route: '/librarian/fines/receive',
    },
    {
      icon: 'library_books',
      iconTone: 'secondary',
      title: 'Quản lý kho sách',
      description: 'Tra cứu, thêm mới, chỉnh sửa và xóa thông tin sách trong kho.',
      ctaLabel: 'Quản lý kho sách',
      ctaTone: 'secondary',
      route: '/librarian/books',
    },
    {
      icon: 'category',
      iconTone: 'primary',
      title: 'Quản lý danh mục',
      description: 'Quản lý các danh mục sách trong thư viện.',
      ctaLabel: 'Quản lý danh mục',
      ctaTone: 'primary',
      route: '/librarian/catalog',
      queryParams: { tab: 'categories' },
    },
    {
      icon: 'person',
      iconTone: 'secondary',
      title: 'Quản lý tác giả',
      description: 'Quản lý danh sách tác giả.',
      ctaLabel: 'Quản lý tác giả',
      ctaTone: 'secondary',
      route: '/librarian/catalog',
      queryParams: { tab: 'authors' },
    },
    {
      icon: 'business',
      iconTone: 'tertiary',
      title: 'Quản lý nhà xuất bản',
      description: 'Quản lý danh sách nhà xuất bản.',
      ctaLabel: 'Quản lý NXB',
      ctaTone: 'tertiary',
      route: '/librarian/catalog',
      queryParams: { tab: 'publishers' },
    },
  ];
}