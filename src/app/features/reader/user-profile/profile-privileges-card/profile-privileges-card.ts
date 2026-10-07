import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Member } from '@model/member/member.model';

@Component({
  selector: 'app-profile-privileges-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './profile-privileges-card.html',
  styleUrls: ['./profile-privileges-card.scss']
})
export class ProfilePrivilegesCard {
  @Input({ required: true }) member!: Member;
}
