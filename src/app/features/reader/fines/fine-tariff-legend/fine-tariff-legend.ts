import { Component } from '@angular/core';
import { SettingService } from '@services/setting.service';
import { TextUtils } from '@shared/utils/text-utils';

@Component({
  selector: 'app-fine-tariff-legend',
  standalone: true,
  imports: [],
  templateUrl: './fine-tariff-legend.html',
  styleUrls: ['./fine-tariff-legend.scss'],
})
export class FineTariffLegendComponent {
  get fineOverduePerDay(): string {
    return TextUtils.toVnd(SettingService.getFineOverduePerDay());
  }

  get fineDamagedLightRate(): string {
    return TextUtils.toPercentage(SettingService.getFineDamagedLightRate());
  }
  get fineDamagedHeavyRepairableRate(): string {
    return TextUtils.toPercentage(SettingService.getFineDamagedHeavyRepairableRate());
  }
  get fineDamagedHeavyIrreparableRate(): string {
    return TextUtils.toPercentage(SettingService.getFineDamagedHeavyIrreparableRate());
  }

  get fineLostRate(): string {
    return TextUtils.toPercentage(SettingService.getFineLostRate());
  }

}
