import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { Setting } from '../models/setting/setting.model';
import { SettingRequest } from '../models/setting/request/setting.request';
import { SettingResponse } from '../models/setting/response/setting.response';
import { SettingMapper } from '../models/setting/setting.mapper';
import { environment } from '@environments/environment';

export const SETTINGS_KEY = 'library_settings';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/settings`;

  loadAndStoreSettings(): Observable<Setting[]> {
    return this.getAll().pipe(
      tap(settings => {
        const settingsMap = settings.reduce((acc, current) => {
          acc[current.settingKey] = current.settingValue;
          return acc;
        }, {} as Record<string, string>);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsMap));
      })
    );
  }

  static getLocalSettings(): Record<string, string> {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : {};
  }

  static getLocalSettingValue(key: string): string | null {
    const settings = this.getLocalSettings();
    return settings[key] || null;
  }

  static clearLocalSettings(): void {
    localStorage.removeItem(SETTINGS_KEY);
  }

  create(request: SettingRequest): Observable<Setting> {
    return this.http.post<ApiResponse<SettingResponse>>(this.apiUrl, request).pipe(
      map(response => SettingMapper.toModel(response.data))
    );
  }

  update(id: number, request: SettingRequest): Observable<Setting> {
    return this.http.put<ApiResponse<SettingResponse>>(`${this.apiUrl}/${id}`, request).pipe(
      map(response => SettingMapper.toModel(response.data))
    );
  }

  delete(id: number): Observable<Setting> {
    return this.http.delete<ApiResponse<SettingResponse>>(`${this.apiUrl}/${id}`).pipe(
      map(response => SettingMapper.toModel(response.data))
    );
  }

  getById(id: number): Observable<Setting> {
    return this.http.get<ApiResponse<SettingResponse>>(`${this.apiUrl}/${id}`).pipe(
      map(response => SettingMapper.toModel(response.data))
    );
  }

  getAll(): Observable<Setting[]> {
    return this.http.get<ApiResponse<SettingResponse[]>>(this.apiUrl).pipe(
      map(response => SettingMapper.toModels(response.data))
    );
  }

  static getFineOverduePerDay(): number {
    return Number(this.getLocalSettingValue('FINE_OVERDUE_PER_DAY')) || 0;
  }

  static getFineLostRate(): number {
    return Number(this.getLocalSettingValue('FINE_LOST_RATE')) || 0;
  }

  static getFineDamagedLightRate(): number {
    return Number(this.getLocalSettingValue('FINE_DAMAGED_LIGHT_RATE')) || 0;
  }

  static getFineDamagedHeavyRepairableRate(): number {
    return Number(this.getLocalSettingValue('FINE_DAMAGED_HEAVY_REPAIRABLE_RATE')) || 0;
  }

  static getFineDamagedHeavyIrreparableRate(): number {
    return Number(this.getLocalSettingValue('FINE_DAMAGED_HEAVY_IRREPARABLE_RATE')) || 0;
  }

  static getMaxBorrowDays(): number {
    return Number(this.getLocalSettingValue('MAX_BORROW_DAYS')) || 0;
  }

  static getMaxBookBorrow(): number {
    return Number(this.getLocalSettingValue('MAX_BOOKS_BORROW')) || 0;
  }

  static getMaxFineBeforeBlock(): number {
    return Number(this.getLocalSettingValue('MAX_FINE_BEFORE_BLOCK')) || 0;
  }

  static getDueReminderDays(): number {
    return Number(this.getLocalSettingValue('DUE_REMINDER_DAYS')) || 0;
  }

  static getMemberPaymentMonth(): number {
    return Number(this.getLocalSettingValue('MEMBER_PAYMENT_MONTH')) || 0;
  }

  static getCardMakerFee(): number {
    return Number(this.getLocalSettingValue('CARD_MAKER_FEE')) || 0;
  }
}
