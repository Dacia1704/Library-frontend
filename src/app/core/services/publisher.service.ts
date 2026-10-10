import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "@environments/environment";
import { ApiResponse, PageResponse } from "@model/api-response";
import { PublisherRequest } from "@model/publisher/request/publisher-request";
import { PublisherResponse } from "@model/publisher/response/publisher-response";
import { Publisher } from "@model/publisher/publisher.model";
import { PublisherMapper } from "@model/publisher/publisher.mapper";

@Injectable({
  providedIn: 'root'
})
export class PublisherService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/publishers`;

  // ===== Create =====

  /**
   * Create a new publisher
   * Backend: POST /api/publishers
   * Requires: PUBLISHER_MANAGE authority
   */
  create(data: PublisherRequest): Observable<ApiResponse<PublisherResponse>> {
    return this.http.post<ApiResponse<PublisherResponse>>(this.api, data);
  }

  // ===== Update =====

  /**
   * Update an existing publisher
   * Backend: PUT /api/publishers/{id}
   * Requires: PUBLISHER_MANAGE authority
   */
  update(
    id: number,
    data: PublisherRequest
  ): Observable<ApiResponse<PublisherResponse>> {
    return this.http.put<ApiResponse<PublisherResponse>>(
      `${this.api}/${id}`,
      data
    );
  }

  /**
   * Restore a deleted publisher
   * Backend: PUT /api/publishers/{id}/restore
   * Requires: PUBLISHER_MANAGE authority
   */
  restore(
    id: number,
    data: PublisherRequest
  ): Observable<ApiResponse<PublisherResponse>> {
    return this.http.put<ApiResponse<PublisherResponse>>(
      `${this.api}/${id}/restore`,
      data
    );
  }

  // ===== Read =====

  /**
   * Get all publishers (flat list, optional keyword search)
   * Backend: GET /api/publishers/all?keyword=
   */
  getPublishers(keyword?: string): Observable<ApiResponse<Publisher[]>> {
    let url = `${this.api}/all`;
    if (keyword) {
      url += `?keyword=${encodeURIComponent(keyword)}`;
    }

    return this.http
      .get<ApiResponse<PublisherResponse[]>>(url)
      .pipe(
        map(response => ({
          ...response,
          data: PublisherMapper.toModelList(response.data)
        }))
      );
  }

  /**
   * Get paginated publisher list with optional keyword search
   * Backend: GET /api/publishers?keyword=&page=&size=
   */
  getPagination(
    keyword?: string,
    page: number = 0,
    size: number = 10
  ): Observable<ApiResponse<PageResponse<Publisher>>> {
    let url = `${this.api}?page=${page}&size=${size}`;
    if (keyword) {
      url += `&keyword=${encodeURIComponent(keyword)}`;
    }

    return this.http
      .get<ApiResponse<PageResponse<PublisherResponse>>>(url)
      .pipe(
        map(response => ({
          ...response,
          data: {
            ...response.data,
            data: PublisherMapper.toModelList(response.data.data)
          }
        }))
      );
  }

  // ===== Delete =====

  /**
   * Soft-delete a publisher
   * Backend: DELETE /api/publishers/{id}
   * Requires: PUBLISHER_MANAGE authority
   */
  delete(id: number): Observable<ApiResponse<PublisherResponse>> {
    return this.http.delete<ApiResponse<PublisherResponse>>(`${this.api}/${id}`);
  }
}
