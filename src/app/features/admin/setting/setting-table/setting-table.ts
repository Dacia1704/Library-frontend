import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingService } from '@core/services/setting.service';
import { Setting } from '@core/models/setting/setting.model';
import { EditSettingModalComponent } from '../edit-setting-modal/edit-setting-modal';

@Component({
  selector: 'app-setting-table',
  standalone: true,
  imports: [NgClass, FormsModule, EditSettingModalComponent],
  templateUrl: './setting-table.html',
  styleUrl: './setting-table.scss',
})
export class SettingTableComponent implements OnInit {
  private settingService = inject(SettingService);

  settings = signal<Setting[]>([]);
  isLoading = signal(false);
  searchTerm = signal('');

  // Edit modal state
  isEditModalOpen = signal(false);
  selectedSetting = signal<Setting | null>(null);

  filteredConfigs = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.settings();
    return this.settings().filter(s => 
      s.settingKey.toLowerCase().includes(term) || 
      s.description.toLowerCase().includes(term)
    );
  });

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

  editSetting(setting: Setting): void {
    this.selectedSetting.set(setting);
    this.isEditModalOpen.set(true);
  }

  onEditModalClosed(): void {
    this.isEditModalOpen.set(false);
    this.selectedSetting.set(null);
  }

  onSettingUpdated(updatedSetting: Setting): void {
    // Update the setting in the list
    const currentSettings = this.settings();
    const index = currentSettings.findIndex(s => s.id === updatedSetting.id);
    if (index !== -1) {
      const newSettings = [...currentSettings];
      newSettings[index] = updatedSetting;
      this.settings.set(newSettings);
    }
    this.onEditModalClosed();
  }

  getSettingByKey(key: string): Setting | undefined {
    return this.settings().find(s => s.settingKey === key);
  }

  getIconConfig(key: string): { icon: string; iconColor: string } {
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

  formatDate(dateString: string): string {
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
