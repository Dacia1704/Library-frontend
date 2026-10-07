import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Member } from '@model/member/member.model';

@Component({
  selector: 'app-card-privileges-status',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './card-privileges-status.html',
  styleUrl: './card-privileges-status.scss'})
export class CardPrivilegesStatus {
  @Input({ required: true }) member!: Member;
  @Input() daysRemaining: number = 0;
}