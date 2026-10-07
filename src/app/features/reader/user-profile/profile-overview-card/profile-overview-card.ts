import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Member } from '@model/member/member.model';
import { ImageUtils } from '@shared/utils/image-utils';

@Component({
  selector: 'app-profile-overview-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './profile-overview-card.html',
  styleUrls: ['./profile-overview-card.scss']
})
export class ProfileOverviewCard {
  @Input({ required: true }) member!: Member;

  get daysRemaining(): number {
    const diff = new Date(this.member.cardExpiry).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }

  get coverSrc(): string {
    return ImageUtils.toImageSrc(this.member?.user?.avatar, 'assets/default-avatar.png');
  }
}
