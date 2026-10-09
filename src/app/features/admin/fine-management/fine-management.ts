import { Component } from '@angular/core';

import { FineManagementHeaderComponent } from './fine-management-header/fine-management-header';
import { FineTableComponent } from './fine-table/fine-table';

@Component({
  selector: 'app-fine-management',
  standalone: true,
  imports: [
    FineManagementHeaderComponent,
    FineTableComponent,
  ],
  templateUrl: './fine-management.html',
  styleUrls: ['./fine-management.scss'],
})
export class FineManagement {}
