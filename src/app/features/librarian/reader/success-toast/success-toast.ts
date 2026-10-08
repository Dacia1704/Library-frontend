import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-success-toast',
  standalone: true,
  imports: [],
  templateUrl: './success-toast.html',
  styleUrls: ['./success-toast.scss'],
})
export class SuccessToastComponent {
  visible = input<boolean>(false);
  readerName = input<string>('');
  readonly closed = output<void>();
  readonly createCard = output<void>();

  close(): void {
    this.closed.emit();
  }

  onCreateCard(): void {
    this.createCard.emit();
  }
}