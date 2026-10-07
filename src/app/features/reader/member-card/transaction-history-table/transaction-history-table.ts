import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MemberPaymentResponse } from '@model/member/response/member-payment-response';

@Component({
  selector: 'app-transaction-history-table',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './transaction-history-table.html',
  styleUrl: './transaction-history-table.scss'})
export class TransactionHistoryTable {
  @Input() transactions: MemberPaymentResponse[] = [];
}