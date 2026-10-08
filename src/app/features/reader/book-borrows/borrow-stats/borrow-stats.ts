import { Component, Input } from '@angular/core';
import { BorrowDetailSummaryResponse } from '@model/borrow-record/response/borrow-detail-summary-response';

@Component({
  selector: 'app-borrow-stats',
  standalone: true,
  imports: [],
  templateUrl: './borrow-stats.html',
  styleUrls: ['./borrow-stats.scss'],
})
export class BorrowStats {
  @Input({ required: true }) summary!: BorrowDetailSummaryResponse;
}
