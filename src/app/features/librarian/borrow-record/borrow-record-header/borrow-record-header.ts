import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-borrow-record-header',
  standalone: true,
  imports: [],
  templateUrl: './borrow-record-header.html',
  styleUrls: ['./borrow-record-header.scss'],
})
export class BorrowRecordHeaderComponent {
  constructor(private router: Router) {}

  navigateToCreate(): void {
    this.router.navigate(['/librarian/borrow-records/create']);
  }
}
