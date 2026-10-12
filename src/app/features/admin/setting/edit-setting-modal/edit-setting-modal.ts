import { Component, input, output, signal, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Setting } from '@core/models/setting/setting.model';
import { SettingService } from '@core/services/setting.service';
import { SettingRequest } from '@core/models/setting/request/setting.request';

@Component({
  selector: 'app-edit-setting-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-setting-modal.html',
  styleUrl: './edit-setting-modal.scss',
})
export class EditSettingModalComponent {
  private settingService = inject(SettingService);

  isOpen = input<boolean>(false);
  setting = input<Setting | null>(null);
  readonly closed = output<void>();
  readonly updated = output<Setting>();

  readonly settingKey = signal('');
  readonly settingValue = signal('');
  readonly description = signal('');
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  // Watch setting input to populate form
  private formEffect = effect(() => {
    const s = this.setting();
    if (s && this.isOpen()) {
      this.settingKey.set(s.settingKey);
      this.settingValue.set(s.settingValue);
      this.description.set(s.description || '');
      this.errorMessage.set(null);
    }
  });

  setSettingValue(value: string): void {
    this.settingValue.set(value);
    this.clearError();
  }

  setDescription(value: string): void {
    this.description.set(value);
  }

  clearError(): void {
    this.errorMessage.set(null);
  }

  close(): void {
    if (this.isSubmitting()) return;
    this.closed.emit();
  }

  submit(event: Event): void {
    event.preventDefault();
    const s = this.setting();
    if (!s || this.isSubmitting()) return;

    // Validation
    if (!this.settingValue().trim()) {
      this.errorMessage.set('Giá trị không được để trống');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const request: SettingRequest = {
      settingKey: s.settingKey,
      settingValue: this.settingValue().trim(),
      description: this.description().trim() || undefined,
    };

    this.settingService.update(s.id, request).subscribe({
      next: (res) => {
        this.updated.emit(res);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'Có lỗi xảy ra khi cập nhật');
      }
    });
  }
}
