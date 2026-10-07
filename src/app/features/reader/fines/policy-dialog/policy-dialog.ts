import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-policy-dialog',
  standalone: true,
  imports: [],
  templateUrl: './policy-dialog.html',
  styleUrls: ['./policy-dialog.scss'],
})
export class PolicyDialogComponent {
  @Output() onClose = new EventEmitter<void>();

  private dialogEl: HTMLDialogElement | null = null;

  show(dialogEl: HTMLDialogElement): void {
    this.dialogEl = dialogEl;
    dialogEl.showModal();
  }

  close(): void {
    if (this.dialogEl) {
      this.dialogEl.close();
    }
    this.onClose.emit();
  }
}
