import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-fines-header',
  standalone: true,
  imports: [],
  templateUrl: './fines-header.html',
  styleUrls: ['./fines-header.scss'],
})
export class FinesHeaderComponent {
  @Output() onPrint = new EventEmitter<void>();
  @Output() onShowPolicy = new EventEmitter<void>();
}
