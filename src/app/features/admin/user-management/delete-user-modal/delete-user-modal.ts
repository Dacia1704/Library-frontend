import { Component, input, output } from '@angular/core';
import { User } from '@model/user/user.model';

@Component({
  selector: 'app-delete-user-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-user-modal.html',
  styleUrl: './delete-user-modal.scss',
})
export class DeleteUserModalComponent {
  isOpen = input<boolean>(false);
  user = input<User | null>(null);
  readonly closed = output<void>();
  readonly confirmed = output<number>();

  close(): void {
    this.closed.emit();
  }

  onConfirm(): void {
    if (this.user()) {
      this.confirmed.emit(this.user()!.id);
    }
  }
}
