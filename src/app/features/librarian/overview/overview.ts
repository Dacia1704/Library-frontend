import { Component } from '@angular/core';

import { OverviewHeaderComponent } from './overview-header/overview-header';
import { QuickActionCardsComponent } from './quick-action-cards/quick-action-cards';
import { OverdueBorrowsTableComponent } from './overdue-borrows-table/overdue-borrows-table';

@Component({
  selector: 'app-librarian-overview',
  standalone: true,
  imports: [
    OverviewHeaderComponent,
    QuickActionCardsComponent,
    OverdueBorrowsTableComponent,
  ],
  templateUrl: './overview.html',
  styleUrls: ['./overview.scss'],
})
export class LibrarianOverview {}