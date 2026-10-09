import { Component, Input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from '@model/member/member.model';
import { CardStatus } from '@model/enum/card-status.enum';
import { SettingService } from '@core/services/setting.service';

@Component({
  selector: 'app-receive-fine-member-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receive-fine-member-card.html',
  styleUrls: ['./receive-fine-member-card.scss'],
})
export class ReceiveFineMemberCardComponent {
  @Input() member!: Member;
  @Input() totalFine = 0;
  @Input() paidAmount = 0;
  @Input() unpaidAmount = 0;
  @Input() unpaidCount = 0;

  private readonly maxFineBeforeBlock = SettingService.getMaxFineBeforeBlock();

  get isLocked(): boolean {
    return this.unpaidAmount > this.maxFineBeforeBlock;
  }

  get cardStatusLabel(): string {
    switch (this.member.cardStatus) {
      case CardStatus.ISSUED:
        return 'Đã phát hành';
      case CardStatus.PENDING:
        return 'Chờ duyệt';
      default:
        return 'Không xác định';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount);
  }
}
