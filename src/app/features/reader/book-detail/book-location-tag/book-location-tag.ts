import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Shelf } from '@model/shelf/shelf.model';

@Component({
  selector: 'app-book-location-tag',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="location-card">
      <div class="location-header">
        <div class="icon-wrap">
          <mat-icon>location_on</mat-icon>
        </div>
        <div class="location-info">
          <span class="label">VỊ TRÍ LƯU KHO CHÍNH XÁC</span>
          <p class="path">
            {{ shelf?.location }} • {{ shelf?.name }} • Kệ {{ shelf?.code }}
          </p>
          <span class="desc">Khu vực sách đọc mở, tự do lấy sách tham khảo tại chỗ.</span>
        </div>
      </div>

      <div class="barcode-box">
        <div class="barcode-info">
          <span class="lbl">Mã định danh Kệ & Mã sách</span>
          <span class="code">LIB-{{ shelf?.code }} & {{ bookCode }}</span>
          <span class="hint">Tip! Bạn có thể quét mã QR tại kệ sách để biết mã kệ chính xác</span>
        </div>
        
        <div class="qr-mockup">
          <!-- Simulated QR Code SVG -->
          <svg fill="none" height="64" viewBox="0 0 68 68" width="64" xmlns="http://www.w3.org/2000/svg">
            <rect fill="none" height="20" rx="3" stroke="currentColor" stroke-width="3" width="20" x="2" y="2"></rect>
            <rect fill="currentColor" height="8" rx="1" width="8" x="8" y="8"></rect>
            <rect fill="none" height="20" rx="3" stroke="currentColor" stroke-width="3" width="20" x="46" y="2"></rect>
            <rect fill="currentColor" height="8" rx="1" width="8" x="52" y="8"></rect>
            <rect fill="none" height="20" rx="3" stroke="currentColor" stroke-width="3" width="20" x="2" y="46"></rect>
            <rect fill="currentColor" height="8" rx="1" width="8" x="8" y="52"></rect>
            <rect fill="currentColor" height="4" width="4" x="26" y="4"></rect>
            <rect fill="currentColor" height="4" width="4" x="34" y="4"></rect>
            <rect fill="currentColor" height="4" width="4" x="38" y="10"></rect>
            <rect fill="currentColor" height="4" width="6" x="28" y="16"></rect>
            <rect fill="currentColor" height="4" width="4" x="4" y="26"></rect>
            <rect fill="currentColor" height="6" width="4" x="12" y="30"></rect>
            <rect fill="currentColor" height="4" width="4" x="20" y="26"></rect>
            <rect fill="currentColor" height="4" width="4" x="28" y="26"></rect>
            <rect fill="currentColor" height="6" width="6" x="36" y="24"></rect>
            <rect fill="currentColor" height="4" width="4" x="46" y="28"></rect>
            <rect fill="currentColor" height="4" width="4" x="54" y="26"></rect>
            <rect fill="currentColor" height="6" width="4" x="60" y="32"></rect>
            <rect fill="currentColor" height="4" width="4" x="26" y="38"></rect>
            <rect fill="currentColor" height="4" width="4" x="34" y="34"></rect>
            <rect fill="currentColor" height="4" width="4" x="42" y="38"></rect>
            <rect fill="currentColor" height="4" width="6" x="50" y="42"></rect>
            <rect fill="currentColor" height="4" width="4" x="30" y="48"></rect>
            <rect fill="currentColor" height="6" width="4" x="38" y="46"></rect>
            <rect fill="currentColor" height="4" width="6" x="26" y="58"></rect>
            <rect fill="currentColor" height="4" width="4" x="46" y="54"></rect>
            <rect fill="currentColor" height="4" width="4" x="54" y="50"></rect>
            <rect fill="currentColor" height="6" width="6" x="58" y="58"></rect>
          </svg>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .location-card { background: #dce9ff; padding: 16px; border-radius: 8px; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .location-header { display: flex; align-items: flex-start; gap: 12px; }
    .icon-wrap { width: 40px; height: 40px; border-radius: 8px; background: #1e40af; color: #ffffff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; mat-icon { font-size: 24px; width: 24px; height: 24px; } }
    .location-info { display: flex; flex-direction: column; }
    .location-info .label { font-size: 11px; font-weight: 700; color: #00288e; letter-spacing: 0.05em; }
    .location-info .path { font-size: 14px; font-weight: 700; color: #0b1c30; margin: 2px 0; line-height: 1.4; }
    .location-info .desc { font-size: 12px; color: #444653; }
    
    .barcode-box { background: #ffffff; padding: 16px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .barcode-info { display: flex; flex-direction: column; }
    .barcode-info .lbl { font-size: 11px; color: #757684; }
    .barcode-info .code { font-family: monospace; font-size: 16px; font-weight: 700; color: #00288e; letter-spacing: 0.05em; margin: 2px 0; }
    .barcode-info .hint { font-size: 11px; color: #444653; }
    
    .qr-mockup { background: #eff4ff; padding: 8px; border-radius: 6px; flex-shrink: 0; color: #0b1c30; display: flex; align-items: center; justify-content: center; }
  `]
})
export class BookLocationTag {
  @Input() shelf!: Shelf;
  @Input() bookCode: string = '';
}