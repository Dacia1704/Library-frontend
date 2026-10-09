import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ApiResponse, PageResponse } from '@model/api-response';
import { FinePayment } from '@model/fine/fine-payment.model';
import { FinePaymentMapper } from '@model/fine/fine-payment.mapper';
import { FinePaymentRequest } from '@model/fine/request/fine-payment-request';
import { FinePaymentResponse } from '@model/fine/response/fine-payment-response';

@Injectable({ providedIn: 'root' })
export class FinePaymentService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/fine-payments`;

  /**
   * Lấy danh sách thanh toán phạt của bạn đọc hiện tại
   * GET /api/fine-payments/me
   */
  getMyPayments(page: number = 0, size: number = 10): Observable<PageResponse<FinePayment>> {
    return this.http
      .get<ApiResponse<PageResponse<FinePaymentResponse>>>(`${this.api}/me`, {
        params: new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString()),
      })
      .pipe(
        map((response) => ({
          currentPage: response.data.currentPage,
          pageSize: response.data.pageSize,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          data: FinePaymentMapper.fromResponseList(response.data.data),
        }))
      );
  }

  /**
   * Lấy danh sách tất cả thanh toán phạt (cho librarian)
   * GET /api/fine-payments
   */
  getAll(
    memberId?: number,
    page: number = 0,
    size: number = 10
  ): Observable<PageResponse<FinePayment>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (memberId) {
      params = params.set('memberId', memberId.toString());
    }

    return this.http
      .get<ApiResponse<PageResponse<FinePaymentResponse>>>(this.api, { params })
      .pipe(
        map((response) => ({
          currentPage: response.data.currentPage,
          pageSize: response.data.pageSize,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          data: FinePaymentMapper.fromResponseList(response.data.data),
        }))
      );
  }

  /**
   * Tạo thanh toán phạt mới (cho librarian)
   * POST /api/fine-payments
   */
  create(request: FinePaymentRequest): Observable<FinePayment> {
    return this.http
      .post<ApiResponse<FinePaymentResponse>>(`${this.api}`, request)
      .pipe(map((response) => FinePaymentMapper.fromResponse(response.data)));
  }

  /**
   * Lấy tổng tiền đã thanh toán phạt của bạn đọc hiện tại
   * GET /api/fine-payments/total/me
   */
  getMyTotal(): Observable<number> {
    return this.http
      .get<ApiResponse<number>>(`${this.api}/total/me`)
      .pipe(map((response) => response.data));
  }

  /**
   * Lấy tổng tiền đã thanh toán phạt theo userId (cho librarian)
   * GET /api/fine-payments/total
   */
  getTotalByUserId(userId: number): Observable<number> {
    return this.http
      .get<ApiResponse<number>>(`${this.api}/total`, {
        params: new HttpParams().set('userId', userId.toString()),
      })
      .pipe(map((response) => response.data));
  }

  /**
   * Lấy tổng tiền đã thanh toán phạt theo memberId (cho librarian)
   * GET /api/fine-payments/total
   */
  getTotalByMemberId(memberId: number): Observable<number> {
    return this.http
      .get<ApiResponse<number>>(`${this.api}/total`, {
        params: new HttpParams().set('memberId', memberId.toString()),
      })
      .pipe(map((response) => response.data));
  }
}