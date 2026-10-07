import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberCardHeader } from './member-card-header/member-card-header';
import { DigitalCardVisual } from './digital-card-visual/digital-card-visual';
import { CardRenewalAlert } from './card-renewal-alert/card-renewal-alert';
import { CardPrivilegesStatus } from './card-privileges-status/card-privileges-status';
import { TransactionHistoryTable } from './transaction-history-table/transaction-history-table';
import { CardFaqGuidelines } from './card-faq-guidelines/card-faq-guidelines';
import { Member } from '@model/member/member.model';
import { MemberPaymentResponse } from '@model/member/response/member-payment-response';
import { MemberService } from '@core/services/member.service';
import { MemberPaymentService } from '@core/services/member-payment.service';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [
    CommonModule,
    MemberCardHeader,
    DigitalCardVisual,
    CardRenewalAlert,
    CardPrivilegesStatus,
    TransactionHistoryTable,
    CardFaqGuidelines
  ],
  templateUrl: './member-card.html',
  styleUrls: ['./member-card.scss']
})
export class MemberCard implements OnInit {
  private memberService = inject(MemberService);
  private memberPaymentService = inject(MemberPaymentService);

  member = signal<Member | null>(null);
  transactions = signal<MemberPaymentResponse[]>([]);
  
  daysRemaining = computed(() => {
    const m = this.member();
    if (!m?.cardExpiry) return 0;
    const today = new Date().getTime();
    const expiry = new Date(m.cardExpiry).getTime();
    const diff = expiry - today;
    return Math.ceil(diff / (1000 * 3600 * 24));
  });

  ngOnInit() {
    this.memberService.getMe().subscribe({
      next: (res) => {
        this.member.set(res.data);
      },
      error: (err) => console.error(err)
    });

    this.memberPaymentService.getMe(null, 0, 10).subscribe({
      next: (res) => {
        this.transactions.set(res.data.data);
      },
      error: (err) => console.error(err)
    });
  }
}