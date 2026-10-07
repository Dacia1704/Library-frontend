import { Setting } from './setting.model';
import { SettingResponse } from './response/setting.response';

export class SettingMapper {
  static toModel(response: SettingResponse): Setting {
    return {
      id: response.id,
      settingKey: response.settingKey,
      settingValue: response.settingValue,
      description: response.description,
      updatedAt: response.updatedAt
    };
  }

  static toModels(responses: SettingResponse[]): Setting[] {
    return responses.map(response => this.toModel(response));
  }
}
