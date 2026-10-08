import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Member } from '@model/member/member.model';

@Component({
  selector: 'app-profile-identity-info',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './profile-identity-info.html',
  styleUrls: ['./profile-identity-info.scss']
})
export class ProfileIdentityInfo {
  @Input({ required: true }) member!: Member;
}
