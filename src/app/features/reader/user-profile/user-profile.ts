import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileHeaderComponent } from './profile-header/profile-header';
import { ProfileNoticeBannerComponent } from './profile-notice-banner/profile-notice-banner';
import { ProfileOverviewCardComponent } from './profile-overview-card/profile-overview-card';
import { ProfilePrivilegesCardComponent } from './profile-privileges-card/profile-privileges-card';
import { ProfileIdentityInfoComponent } from './profile-identity-info/profile-identity-info';
import { ProfileContactInfoComponent } from './profile-contact-info/profile-contact-info';
import { ProfileDigitalCardComponent } from './profile-digital-card/profile-digital-card';
import { ProfileRulesComponent } from './profile-rules/profile-rules';
import { SupportHelpdeskComponent } from './support-helpdesk/support-helpdesk';
import { Member } from '@model/member/member.model';
import { User } from '@model/user/user.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ProfileHeaderComponent,
    ProfileNoticeBannerComponent,
    ProfileOverviewCardComponent,
    ProfilePrivilegesCardComponent,
    ProfileIdentityInfoComponent,
    ProfileContactInfoComponent,
    ProfileDigitalCardComponent,
    ProfileRulesComponent,
    SupportHelpdeskComponent
  ],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss']
})
export class UserProfile implements OnInit {
  member!: Member;

  ngOnInit() {
    // Mock Data
    const mockUser = new User({
      id: 1,
      username: 'nguyenvanan.bd',
      fullName: 'Nguyễn Văn An',
      email: 'nguyenvanan@thuvien.edu.vn',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-rTA_qCLrmGltp72l7Try1FM0ut8Uhagt1VdNEY5u2OpxLfeRy6A7hXALMPbWKRgWAshGB8aX-v30_e3BdssNT4vhmiOp2XwWJ-FoGx1_LpDWjUqaEMSFzzRH3dxUF71uMbn9713FbxBxXdnkZfoJDDxMR2cNjQfBJ8k6k9hQjs4SEeCAZc-ABjgfhLYjpq7eUG5yTOAQ8A6DvX0fF4D7sPagETFJcMwDLgqo9Ra_i3CPBF1BukBBUA',
      roleId: 2,
      roleName: 'Bạn đọc',
      isActive: true,
      createdAt: new Date('2023-09-15T08:30:00')
    });

    this.member = new Member({
      id: 1,
      user: mockUser,
      memberCode: 'BD-2023-08942',
      phone: '0912 345 678',
      address: 'Số 42, Phố Tràng Thi, Phường Hàng Trống, Quận Hoàn Kiếm, Hà Nội',
      identityNumber: '001200018924',
      cardExpiry: new Date('2026-09-15')
    });
  }
}