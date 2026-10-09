import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "@environments/environment";
import { ApiResponse, PageResponse } from "@model/api-response";
import { AuthorRequest } from "@model/author/request/author-request";
import { AuthorResponse } from "@model/author/response/author-response";
import { Author } from "@model/author/author.model";
import { AuthorMapper } from "@model/author/author.mapper";

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/authors`;

  // ===== Create =====

  /**
   * Create a new author
   * Backend: POST /api/authors
   * Requires: AUTHOR_MANAGE authority
   */
  create(data: AuthorRequest): Observable<ApiResponse<AuthorResponse>> {
    return this.http.post<ApiResponse<AuthorResponse>>(this.api, data);
  }

  // ===== Update =====

  /**
   * Update an existing author
   * Backend: PUT /api/authors/{id}
   * Requires: AUTHOR_MANAGE authority
   */
  update(
    id: number,
    data: AuthorRequest
  ): Observable<ApiResponse<AuthorResponse>> {
    return this.http.put<ApiResponse<AuthorResponse>>(
      `${this.api}/${id}`,
      data
    );
  }

  /**
   * Restore a deleted author
   * Backend: PUT /api/authors/{id}/restore
   * Requires: AUTHOR_MANAGE authority
   */
  restore(
    id: number,
    data: AuthorRequest
  ): Observable<ApiResponse<AuthorResponse>> {
    return this.http.put<ApiResponse<AuthorResponse>>(
      `${this.api}/${id}/restore`,
      data
    );
  }

  // ===== Read =====

  /**
   * Get all authors (flat list)
   * Backend: GET /api/authors/all
   */
  getAuthors(): Observable<ApiResponse<Author[]>> {
    return this.http
      .get<ApiResponse<AuthorResponse[]>>(`${this.api}/all`)
      .pipe(
        map(response => ({
          ...response,
          data: AuthorMapper.toModelList(response.data)
        }))
      );
  }

  /**
   * Get paginated author list with optional keyword search
   * Backend: GET /api/authors?keyword=&page=&size=
   */
  getPagination(
    keyword?: string,
    page: number = 0,
    size: number = 10
  ): Observable<ApiResponse<PageResponse<Author>>> {
    let url = `${this.api}?page=${page}&size=${size}`;
    if (keyword) {
      url += `&keyword=${encodeURIComponent(keyword)}`;
    }

    return this.http
      .get<ApiResponse<PageResponse<AuthorResponse>>>(url)
      .pipe(
        map(response => ({
          ...response,
          data: {
            ...response.data,
            data: AuthorMapper.toModelList(response.data.data)
          }
        }))
      );
  }

  // ===== Delete =====

  /**
   * Soft-delete an author
   * Backend: DELETE /api/authors/{id}
   * Requires: AUTHOR_MANAGE authority
   */
  delete(id: number): Observable<ApiResponse<AuthorResponse>> {
    return this.http.delete<ApiResponse<AuthorResponse>>(`${this.api}/${id}`);
  }
}
