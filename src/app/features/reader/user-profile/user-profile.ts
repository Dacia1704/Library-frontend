import { Component, inject, OnInit, signal } from '@angular/core';
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
import { MemberService } from '@services/member.service';
import { ToastService } from '@services/toast.service';

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