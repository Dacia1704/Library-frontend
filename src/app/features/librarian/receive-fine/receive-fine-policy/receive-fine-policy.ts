import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingService } from '@core/services/setting.service';

@Component({
  selector: 'app-receive-fine-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receive-fine-policy.html',
  styleUrls: ['./receive-fine-policy.scss'],
})
export class ReceiveFinePolicyComponent {
  @Input() unpaidAmount = 0;

  get maxFineBeforeBlock(): number {
    return SettingService.getMaxFineBeforeBlock();
  }
}
