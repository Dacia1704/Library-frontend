import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ApiResponse, PageResponse } from '@model/api-response';
import { Fine } from '@model/fine/fine.model';
import { FineResponse } from '@model/fine/response/fine-response';
import { FineMapper } from '@model/fine/fine.mapper';

@Injectable({ providedIn: 'root' })
export class FineService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/fines`;

  /**
   * Lấy danh sách các khoản phạt của bạn đọc hiện tại
   * GET /api/fines/me
   */
  getMyFines(page: number = 0, size: number = 10): Observable<PageResponse<Fine>> {
    return this.http
      .get<ApiResponse<PageResponse<FineResponse>>>(`${this.api}/me`, {
        params: new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString()),
      })
      .pipe(
        map((response) => { 
          console.log(FineMapper.fromResponseList(response.data.data));
          return {
          currentPage: response.data.currentPage,
          pageSize: response.data.pageSize,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          data: FineMapper.fromResponseList(response.data.data),
        }})
      );
  }

  /**
   * Lấy danh sách tất cả các khoản phạt (cho librarian)
   * GET /api/fines
   */
  getAll(
    memberId?: number,
    page: number = 0,
    size: number = 10
  ): Observable<PageResponse<Fine>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (memberId) {
      params = params.set('memberId', memberId.toString());
    }

    return this.http
      .get<ApiResponse<PageResponse<FineResponse>>>(this.api, { params })
      .pipe(
        map((response) => ({
          currentPage: response.data.currentPage,
          pageSize: response.data.pageSize,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          data: FineMapper.fromResponseList(response.data.data),
        }))
      );
  }

  /**
   * Lấy tổng tiền phạt còn phải nộp của bạn đọc hiện tại
   * GET /api/fines/total/me
   */
  getMyTotal(): Observable<number> {
    return this.http
      .get<ApiResponse<number>>(`${this.api}/total/me`)
      .pipe(map((response) => response.data));
  }

  /**
   * Lấy tổng tiền phạt còn phải nộp theo userId (cho librarian)
   * GET /api/fines/total
   */
  getTotalByUserId(userId: number): Observable<number> {
    return this.http
      .get<ApiResponse<number>>(`${this.api}/total`, {
        params: new HttpParams().set('userId', userId.toString()),
      })
      .pipe(map((response) => response.data));
  }
}