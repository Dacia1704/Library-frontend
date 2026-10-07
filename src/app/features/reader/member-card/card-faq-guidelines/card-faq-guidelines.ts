import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SettingService } from '@services/setting.service';

@Component({
  selector: 'app-card-faq-guidelines',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './card-faq-guidelines.html',
  styleUrl: './card-faq-guidelines.scss'})
export class CardFaqGuidelines {
  SettingService = SettingService;
}