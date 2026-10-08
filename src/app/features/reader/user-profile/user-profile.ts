import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileHeader } from './profile-header/profile-header';
import { ProfileNoticeBanner } from './profile-notice-banner/profile-notice-banner';
import { ProfileOverviewCard } from './profile-overview-card/profile-overview-card';
import { ProfilePrivilegesCard } from './profile-privileges-card/profile-privileges-card';
import { ProfileIdentityInfo } from './profile-identity-info/profile-identity-info';
import { ProfileContactInfo } from './profile-contact-info/profile-contact-info';
import { ProfileDigitalCard } from './profile-digital-card/profile-digital-card';
import { ProfileRules } from './profile-rules/profile-rules';
import { SupportHelpdesk } from './support-helpdesk/support-helpdesk';
import { Member } from '@model/member/member.model';
import { User } from '@model/user/user.model';
import { MemberService } from '@services/member.service';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ProfileHeader,
    ProfileNoticeBanner,
    ProfileOverviewCard,
    ProfilePrivilegesCard,
    ProfileIdentityInfo,
    ProfileContactInfo,
    ProfileDigitalCard,
    ProfileRules,
    SupportHelpdesk
  ],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss']
})
export class UserProfile implements OnInit {

  member = signal<Member | null>(null);
  isLoading = signal<boolean>(false);
  private readonly memberService = inject(MemberService);
  private readonly toast = inject(ToastService);

  ngOnInit() {
    this.loadMember();
  }

  private loadMember(): void {
    this.isLoading.set(true);

    this.memberService.getMe().subscribe({
      next: response => {
        this.member.set(response.data);

        console.log(this.member());

        this.isLoading.set(false);
      },

      error: error => {
        console.error('Lỗi khi tải thông tin cá nhân:', error);
        this.toast.error('Không thể tải thông tin cá nhân');
        this.isLoading.set(false);
      }
    });
  }
}
