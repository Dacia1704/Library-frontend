import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "@environments/environment";
import { ApiResponse } from "@model/api-response";
import { CategoryRequest } from "@model/category/request/category-request";
import { CategoryResponse } from "@model/category/response/category-response";
import { Category } from "@model/category/category.model";
import { CategoryMapper } from "@model/category/category.mapper";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/categories`;

  // ===== Create =====

  /**
   * Create a new category
   * Backend: POST /api/categories
   * Requires: CATEGORY_MANAGE authority
   */
  create(data: CategoryRequest): Observable<ApiResponse<CategoryResponse>> {
    return this.http.post<ApiResponse<CategoryResponse>>(this.api, data);
  }

  // ===== Update =====

  /**
   * Update an existing category
   * Backend: PUT /api/categories/{id}
   * Requires: CATEGORY_MANAGE authority
   */
  update(
    id: number,
    data: CategoryRequest
  ): Observable<ApiResponse<CategoryResponse>> {
    return this.http.put<ApiResponse<CategoryResponse>>(
      `${this.api}/${id}`,
      data
    );
  }

  /**
   * Restore a deleted category
   * Backend: PUT /api/categories/{id}/restore
   * Requires: CATEGORY_MANAGE authority
   */
  restore(
    id: number,
    data: CategoryRequest
  ): Observable<ApiResponse<CategoryResponse>> {
    return this.http.put<ApiResponse<CategoryResponse>>(
      `${this.api}/${id}/restore`,
      data
    );
  }

  // ===== Read =====

  /**
   * Get all categories (flat list)
   * Backend: GET /api/categories
   */
  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http
      .get<ApiResponse<CategoryResponse[]>>(this.api)
      .pipe(
        map(response => ({
          ...response,
          data: CategoryMapper.toModelList(response.data)
        }))
      );
  }

  // ===== Delete =====

  /**
   * Soft-delete a category
   * Backend: DELETE /api/categories/{id}
   * Requires: CATEGORY_MANAGE authority
   */
  delete(id: number): Observable<ApiResponse<CategoryResponse>> {
    return this.http.delete<ApiResponse<CategoryResponse>>(`${this.api}/${id}`);
  }
}
