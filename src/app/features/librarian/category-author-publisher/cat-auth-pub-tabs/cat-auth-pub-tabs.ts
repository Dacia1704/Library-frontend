import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

type TabKey = 'categories' | 'authors' | 'publishers';

@Component({
  selector: 'app-cat-auth-pub-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cat-auth-pub-tabs.html',
  styleUrls: ['./cat-auth-pub-tabs.scss'],
})
export class CatAuthPubTabsComponent {
  @Input() activeTab: TabKey = 'categories';
  @Input() tabCounts: Record<TabKey, number> = {
    categories: 0,
    authors: 0,
    publishers: 0,
  };

  @Output() tabChange = new EventEmitter<TabKey>();

  onTabChange(tab: TabKey): void {
    this.tabChange.emit(tab);
  }
}
