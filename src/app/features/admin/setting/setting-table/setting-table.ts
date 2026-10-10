import { Component, OnInit, signal, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingService } from '@core/services/setting.service';
import { Setting } from '@core/models/setting/setting.model';

interface ConfigRow {
  key: string;
  value: string;
  description: string;
  updatedAt: string;
  updatedBy: string;
  icon: string;
  iconColor: string;
}

@Component({
  selector: 'app-setting-table',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './setting-table.html',
  styleUrl: './setting-table.scss',
})
export class SettingTableComponent implements OnInit {

  settings = signal<Setting[]>([]);
  isLoading = signal(false);
  searchTerm = signal('');

  filteredConfigs = computed(() => {
    const configs = this.settings().map(s => this.mapToConfigRow(s));
    const term = this.searchTerm().toLowerCase();
    if (!term) return configs;
    return configs.filter(c => 
      c.key.toLowerCase().includes(term) || 
      c.description.toLowerCase().includes(term)
    );
  });

  constructor(private settingService: SettingService) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.isLoading.set(true);
    this.settingService.getAll().subscribe({
      next: (data) => {
        this.settings.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load settings:', err);
        this.isLoading.set(false);
      }
    });
  }

  private getIconConfig(key: string): { icon: string; iconColor: string } {
    const keyUpper = key.toUpperCase();
    if (keyUpper.includes('FINE') || keyUpper.includes('PENALTY')) {
      return { icon: 'gavel', iconColor: 'error' };
    }
    if (keyUpper.includes('BORROW') || keyUpper.includes('LOAN')) {
      return { icon: 'book', iconColor: 'secondary' };
    }
    if (keyUpper.includes('FEE') || keyUpper.includes('PRICE') || keyUpper.includes('COST')) {
      return { icon: 'monetization_on', iconColor: 'tertiary' };
    }
    if (keyUpper.includes('SECURITY') || keyUpper.includes('SESSION') || keyUpper.includes('AUTH')) {
      return { icon: 'lock_clock', iconColor: 'tertiary' };
    }
    if (keyUpper.includes('APP') || keyUpper.includes('SYSTEM') || keyUpper.includes('NAME')) {
      return { icon: 'title', iconColor: 'primary' };
    }
    if (keyUpper.includes('REMINDER') || keyUpper.includes('NOTIFY')) {
      return { icon: 'notifications', iconColor: 'secondary' };
    }
    return { icon: 'settings', iconColor: 'primary' };
  }

  private mapToConfigRow(setting: Setting): ConfigRow {
    const iconConfig = this.getIconConfig(setting.settingKey);
    return {
      key: setting.settingKey,
      value: setting.settingValue,
      description: setting.description,
      updatedAt: this.formatDate(setting.updatedAt),
      updatedBy: setting.updatedBy,
      icon: iconConfig.icon,
      iconColor: iconConfig.iconColor
    };
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }
}
