import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "@environments/environment";
import { ApiResponse, PageResponse } from "@model/api-response";
import { BorrowDetail } from "@model/borrow-record/borrow-detail";
import { BorrowDetailMapper } from "@model/borrow-record/borrow-detail.mapper";
import { BorrowDetailFilter } from "@model/borrow-record/request/borrow-detail-filter";
import { BorrowDetailResponse } from "@model/borrow-record/response/borrow-detail-response";
import { BorrowDetailSummaryResponse } from "@model/borrow-record/response/borrow-detail-summary-response";
import { ReturnBookRequest } from "@model/borrow-record/request/return-book-request";

@Injectable({
  providedIn: 'root'
})
export class BorrowDetailService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/borrow-details`;

  getById(id: string): Observable<ApiResponse<BorrowDetail>> {
    return this.http
      .get<ApiResponse<BorrowDetailResponse>>(`${this.api}/${id}`)
      .pipe(
        map(response => ({
          ...response,
          data: BorrowDetailMapper.fromResponse(response.data)
        }))
      );
  }

  getAll(): Observable<ApiResponse<BorrowDetail[]>> {
    return this.http
      .get<ApiResponse<BorrowDetailResponse[]>>(this.api)
      .pipe(
        map(response => ({
          ...response,
          data: BorrowDetailMapper.fromResponseList(response.data)
        }))
      );
  }

  getPagination(
    filter: BorrowDetailFilter,
    page: number,
    size: number
  ): Observable<ApiResponse<PageResponse<BorrowDetail>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filter.status) params = params.set('status', filter.status);
    if (filter.keyword) params = params.set('keyword', filter.keyword);
    if (filter.year != null) params = params.set('year', filter.year.toString());

    return this.http
      .get<ApiResponse<PageResponse<BorrowDetailResponse>>>(`${this.api}/pagination`,{ params })
      .pipe(
        map(response => ({
          ...response,
          data: {
            ...response.data,
            data: BorrowDetailMapper.fromResponseList(response.data.data)
          }
        }))
      );
  }

  getMySummary(): Observable<ApiResponse<BorrowDetailSummaryResponse>> {
    return this.http
      .get<ApiResponse<BorrowDetailSummaryResponse>>(`${this.api}/summary/me`);
  }

  getMyPagination(
    filter: BorrowDetailFilter,
    page: number,
    size: number
  ): Observable<ApiResponse<PageResponse<BorrowDetail>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filter.status) params = params.set('status', filter.status);
    if (filter.keyword) params = params.set('keyword', filter.keyword);
    if (filter.year != null) params = params.set('year', filter.year.toString());

    return this.http
      .get<ApiResponse<PageResponse<BorrowDetailResponse>>>(
        `${this.api}/pagination/me`,
        { params }
      )
      .pipe(
        map(response => {
          console.log(response);
          return {
          ...response,
          data: {
            ...response.data,
            data: BorrowDetailMapper.fromResponseList(response.data.data)
          }
        }})
      );
  }

  returnBook(id: string, data: ReturnBookRequest): Observable<ApiResponse<BorrowDetail>> {
    const formData = new FormData();

    data.fineRequests.forEach((fine, index) => {
      formData.append(`fineRequests[${index}].reason`, fine.reason);
      if (fine.note) formData.append(`fineRequests[${index}].note`, fine.note);
      if (fine.attachment) formData.append(`fineRequests[${index}].attachment`, fine.attachment);
    });

    return this.http
      .put<ApiResponse<BorrowDetailResponse>>(`${this.api}/${id}/return`, formData)
      .pipe(
        map(response => ({
          ...response,
          data: BorrowDetailMapper.fromResponse(response.data)
        }))
      );
  }
}