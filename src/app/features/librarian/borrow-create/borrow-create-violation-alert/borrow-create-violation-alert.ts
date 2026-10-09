import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-borrow-create-violation-alert',
  standalone: true,
  imports: [],
  templateUrl: './borrow-create-violation-alert.html',
  styleUrls: ['./borrow-create-violation-alert.scss'],
})
export class BorrowCreateViolationAlertComponent {
  @Input() hasViolation = false;
  @Input() violationMessage = '';
  @Output() dismiss = new EventEmitter<void>();

  onDismiss(): void {
    this.dismiss.emit();
  }
}
