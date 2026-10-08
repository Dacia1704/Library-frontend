import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "@environments/environment";
import { ApiResponse, PageResponse } from "@model/api-response";
import { BorrowRecord } from "@model/borrow-record/borrow-record";
import { BorrowRecordMapper } from "@model/borrow-record/borrow-record.mapper";
import { BorrowRecordFilter } from "@model/borrow-record/request/borrow-record-filter";
import { BorrowRecordRequest } from "@model/borrow-record/request/borrow-record-request";
import { BorrowRecordResponse } from "@model/borrow-record/response/borrow-record-response";

@Injectable({
  providedIn: 'root'
})
export class BorrowRecordService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/borrow-records`;

  create(data: BorrowRecordRequest): Observable<ApiResponse<BorrowRecord>> {
    return this.http
      .post<ApiResponse<BorrowRecordResponse>>(this.api, data)
      .pipe(
        map(response => ({
          ...response,
          data: BorrowRecordMapper.fromResponse(response.data)
        }))
      );
  }

  update(id: number, data: BorrowRecordRequest): Observable<ApiResponse<BorrowRecord>> {
    return this.http
      .put<ApiResponse<BorrowRecordResponse>>(`${this.api}/${id}`, data)
      .pipe(
        map(response => ({
          ...response,
          data: BorrowRecordMapper.fromResponse(response.data)
        }))
      );
  }

  delete(id: string): Observable<ApiResponse<BorrowRecord>> {
    return this.http
      .delete<ApiResponse<BorrowRecordResponse>>(`${this.api}/${id}`)
      .pipe(
        map(response => ({
          ...response,
          data: BorrowRecordMapper.fromResponse(response.data)
        }))
      );
  }

  getById(id: string): Observable<ApiResponse<BorrowRecord>> {
    return this.http
      .get<ApiResponse<BorrowRecordResponse>>(`${this.api}/${id}`)
      .pipe(
        map(response => ({
          ...response,
          data: BorrowRecordMapper.fromResponse(response.data)
        }))
      );
  }

  getAll(): Observable<ApiResponse<BorrowRecord[]>> {
    return this.http
      .get<ApiResponse<BorrowRecordResponse[]>>(this.api)
      .pipe(
        map(response => ({
          ...response,
          data: BorrowRecordMapper.fromResponseList(response.data)
        }))
      );
  }

  getPagination(
    filter: BorrowRecordFilter,
    page: number,
    size: number
  ): Observable<ApiResponse<PageResponse<BorrowRecord>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filter.memberKeyword) params = params.set('memberKeyword', filter.memberKeyword);
    if (filter.bookKeyword) params = params.set('bookKeyword', filter.bookKeyword);
    if (filter.startBorrowDate) params = params.set('startBorrowDate', filter.startBorrowDate);
    if (filter.endBorrowDate) params = params.set('endBorrowDate', filter.endBorrowDate);
    if (filter.status) params = params.set('status', filter.status);

    return this.http
      .get<ApiResponse<PageResponse<BorrowRecordResponse>>>(
        `${this.api}/pagination`,
        { params }
      )
      .pipe(
        map(response => ({
          ...response,
          data: {
            ...response.data,
            data: BorrowRecordMapper.fromResponseList(response.data.data)
          }
        }))
      );
  }
}
