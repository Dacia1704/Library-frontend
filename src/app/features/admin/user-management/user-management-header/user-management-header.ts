import { Component, output } from '@angular/core';

@Component({
  selector: 'app-user-management-header',
  standalone: true,
  templateUrl: './user-management-header.html',
  styleUrl: './user-management-header.scss',
})
export class UserManagementHeaderComponent {
  readonly createUserClicked = output<void>();

  onCreateUser(): void {
    this.createUserClicked.emit();
  }
}
