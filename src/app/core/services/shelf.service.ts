import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "@environments/environment";
import { ApiResponse } from "@model/api-response";
import { ShelfRequest } from "@model/shelf/request/shelf-request";
import { ShelfResponse } from "@model/shelf/response/shelf-response";
import { Shelf } from "@model/shelf/shelf.model";
import { ShelfMapper } from "@model/shelf/shelf.mapper";

@Injectable({
  providedIn: 'root'
})
export class ShelfService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/shelves`;

  // ===== Create =====

  /**
   * Create a new shelf
   * Backend: POST /api/shelves
   * Requires: SHELF_WRITE authority
   */
  create(data: ShelfRequest): Observable<ApiResponse<ShelfResponse>> {
    return this.http.post<ApiResponse<ShelfResponse>>(this.api, data);
  }

  // ===== Read =====

  /**
   * Get all shelves (flat list)
   * Backend: GET /api/shelves
   */
  getAll(): Observable<ApiResponse<Shelf[]>> {
    return this.http
      .get<ApiResponse<ShelfResponse[]>>(this.api)
      .pipe(
        map(response => ({
          ...response,
          data: ShelfMapper.toModelList(response.data)
        }))
      );
  }

  /**
   * Get a single shelf by ID
   * Backend: GET /api/shelves/{id}
   * Requires: SHELF_READ authority
   */
  getById(id: number): Observable<ApiResponse<ShelfResponse>> {
    return this.http.get<ApiResponse<ShelfResponse>>(`${this.api}/${id}`);
  }

  /**
   * Get shelves with pagination
   * Backend: GET /api/shelves/pagination
   */
  getPagination(
    keyword: string = '',
    page: number = 0,
    size: number = 12
  ): Observable<ApiResponse<{ data: Shelf[]; totalElements: number; totalPages: number }>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (keyword && keyword.trim()) {
      params = params.set('keyword', keyword.trim());
    }

    return this.http
      .get<ApiResponse<{ data: ShelfResponse[]; totalElements: number; totalPages: number }>>(
        `${this.api}/pagination`,
        { params }
      )
      .pipe(
        map(response => ({
          ...response,
          data: {
            ...response.data,
            data: ShelfMapper.toModelList(response.data.data)
          }
        }))
      );
  }

  // ===== Update =====

  /**
   * Update an existing shelf
   * Backend: PUT /api/shelves/{id}
   * Requires: SHELF_WRITE authority
   */
  update(
    id: number,
    data: ShelfRequest
  ): Observable<ApiResponse<ShelfResponse>> {
    return this.http.put<ApiResponse<ShelfResponse>>(
      `${this.api}/${id}`,
      data
    );
  }

  // ===== Delete =====

  /**
   * Soft-delete a shelf
   * Backend: DELETE /api/shelves/{id}
   * Requires: SHELF_DELETE authority
   */
  delete(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.api}/${id}`);
  }
}
