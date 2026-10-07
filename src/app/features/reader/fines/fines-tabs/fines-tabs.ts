import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fines-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fines-tabs.html',
  styleUrls: ['./fines-tabs.scss'],
})
export class FinesTabsComponent {
  @Input() activeTab: 'fines' | 'history' = 'fines';
  @Input() finesCount: number = 0;
  @Input() historyCount: number = 0;
  @Output() onTabChange = new EventEmitter<'fines' | 'history'>();
}
