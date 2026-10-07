import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Member } from '@model/member/member.model';

@Component({
  selector: 'app-profile-contact-info',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './profile-contact-info.html',
  styleUrls: ['./profile-contact-info.scss']
})
export class ProfileContactInfo {
  @Input({ required: true }) member!: Member;
}
