import { Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { Member } from '@model/member/member.model';
import { FineService } from '@core/services/fine.service';
import { FinePaymentService } from '@core/services/fine-payment.service';
import { BorrowDetailService } from '@core/services/borrow-detail.service';
import { BorrowDetailSummaryResponse } from '@model/borrow-record/response/borrow-detail-summary-response';
import { SettingService } from '@core/services/setting.service';

@Component({
  selector: 'app-profile-privileges-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './profile-privileges-card.html',
  styleUrls: ['./profile-privileges-card.scss']
})
export class ProfilePrivilegesCard implements OnInit {
  @Input({ required: true }) member!: Member;

  private fineService = inject(FineService);
  private finePaymentService = inject(FinePaymentService);
  private borrowDetailService = inject(BorrowDetailService);

  // Borrow signals
  maxBooksBorrow = signal(0);
  borrowingCount = signal(0);
  overdueCount = signal(0);

  // Fine signals
  totalFines = signal(0);
  totalPaid = signal(0);
  pendingOverdueFine = signal(0);

  // Computed
  recordedFine = computed(() => this.totalFines() - this.totalPaid());

  ngOnInit(): void {
    this.maxBooksBorrow.set(SettingService.getMaxBookBorrow());
    this.loadAllData();
  }

  private loadAllData(): void {
    forkJoin({
      borrowSummary: this.borrowDetailService.getMySummary(),
      totalFines: this.fineService.getMyTotal(),
      totalPaid: this.finePaymentService.getMyTotal(),
      pendingOverdueFine: this.borrowDetailService.getMyOverdueFine(),
    }).subscribe({
      next: ({ borrowSummary, totalFines, totalPaid, pendingOverdueFine }) => {
        const summary: BorrowDetailSummaryResponse = borrowSummary.data;
        this.borrowingCount.set(summary?.borrowing ?? 0);
        this.overdueCount.set(summary?.overdue ?? 0);
        this.totalFines.set(totalFines ?? 0);
        this.totalPaid.set(totalPaid ?? 0);
        this.pendingOverdueFine.set(pendingOverdueFine ?? 0);
      },
      error: (err) => console.error('Error loading data:', err),
    });
  }
}
