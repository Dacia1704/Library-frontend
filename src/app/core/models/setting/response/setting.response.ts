export interface SettingResponse {
  id: number;
  settingKey: string;
  settingValue: string;
  description: string;
  updatedAt: string;
  updatedBy?: string;
  isDeleted: boolean;
}