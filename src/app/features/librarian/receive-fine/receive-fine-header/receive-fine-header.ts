import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-receive-fine-header',
  standalone: true,
  imports: [],
  templateUrl: './receive-fine-header.html',
  styleUrls: ['./receive-fine-header.scss'],
})
export class ReceiveFineHeaderComponent {
  @Input() librarian: {
    name: string;
    id: string;
  } = { name: '', id: '' };

  @Input() todayReceiptCount = 0;

  @Output() onRefresh = new EventEmitter<void>();
}
