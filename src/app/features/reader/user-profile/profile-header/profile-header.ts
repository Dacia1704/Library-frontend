import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './profile-header.html',
  styleUrls: ['./profile-header.scss']
})
export class ProfileHeader {
  private readonly router = inject(Router);

  goBack(): void {
    history.back();
  }

  goToBooks(): void {
    this.router.navigate(['/reader/books']);
  }
}
