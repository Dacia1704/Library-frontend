import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-member-card-header',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './member-card-header.html',
  styleUrl: './member-card-header.scss'})
export class MemberCardHeader {
  goBack() { history.back(); }
  printCard() { window.print(); }
}