import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { ApiResponse } from '@model/api-response';
import { Permission } from '@model/role-permission/permission.model';
import { PermissionResponse } from '@model/role-permission/response/permission-response';
import { PermissionMapper } from '@model/role-permission/role-permission.mapper';
import { PermissionRequest } from '@model/role-permission/request/permission-request';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/permissions`;

  /**
   * Get all permissions
   * Backend: GET /api/permissions
   */
  getPermissions(): Observable<ApiResponse<Permission[]>> {
    return this.http
      .get<ApiResponse<PermissionResponse[]>>(`${this.api}`)
      .pipe(
        map((response) => ({
          ...response,
          data: PermissionMapper.fromResponseList(response.data),
        }))
      );
  }

  /**
   * Create a new permission
   * Backend: POST /api/permissions
   */
  createPermission(data: PermissionRequest): Observable<ApiResponse<Permission>> {
    return this.http
      .post<ApiResponse<PermissionResponse>>(`${this.api}`, data)
      .pipe(
        map((response) => ({
          ...response,
          data: PermissionMapper.fromResponse(response.data),
        }))
      );
  }

  /**
   * Update an existing permission
   * Backend: PUT /api/permissions/{id}
   */
  updatePermission(
    id: string,
    data: PermissionRequest
  ): Observable<ApiResponse<Permission>> {
    return this.http
      .put<ApiResponse<PermissionResponse>>(`${this.api}/${id}`, data)
      .pipe(
        map((response) => ({
          ...response,
          data: PermissionMapper.fromResponse(response.data),
        }))
      );
  }

  /**
   * Delete a permission
   * Backend: DELETE /api/permissions/{id}
   */
  deletePermission(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/${id}`);
  }
}
