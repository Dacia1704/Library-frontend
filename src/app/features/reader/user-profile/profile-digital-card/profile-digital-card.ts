import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Member } from '@model/member/member.model';

@Component({
  selector: 'app-profile-digital-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './profile-digital-card.html',
  styleUrls: ['./profile-digital-card.scss']
})
export class ProfileDigitalCard {
  @Input({ required: true }) member!: Member;

  formatCode(code: string): string {
    return code ? code.replace(/-/g, ' - ') : '';
  }
}
