import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Member } from '@model/member/member.model';

@Component({
  selector: 'app-digital-card-visual',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './digital-card-visual.html',
  styleUrl: './digital-card-visual.scss'})
export class DigitalCardVisual {
  @Input({ required: true }) member!: Member;
}