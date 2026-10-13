import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "@environments/environment";

export interface ExportPdfRequest {
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/reports`;

  /**
   * Export statistics as PDF (POST)
   */
  exportStatisticsPdf(request?: ExportPdfRequest): Observable<Blob> {
    return this.http.post(`${this.api}/statistics/export/pdf`, request ?? {}, {
      responseType: 'blob'
    });
  }

  /**
   * Download the PDF blob as a file
   */
  downloadPdf(title?: string, fileName: string = 'statistics_report.pdf'): void {
    this.exportStatisticsPdf({ title }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Failed to download PDF:', err);
      }
    });
  }
}
