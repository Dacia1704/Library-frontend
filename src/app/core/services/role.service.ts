import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { ApiResponse } from '@model/api-response';
import { Role } from '@model/role-permission/role.model';
import { RoleResponse } from '@model/role-permission/response/role-response';
import { RoleMapper } from '@model/role-permission/role-permission.mapper';
import { RoleRequest } from '@model/role-permission/request/role-request';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/roles`;

  /**
   * Get all roles
   * Backend: GET /api/roles
   */
  getRoles(): Observable<ApiResponse<Role[]>> {
    return this.http
      .get<ApiResponse<RoleResponse[]>>(`${this.api}`)
      .pipe(
        map((response) => ({
          ...response,
          data: RoleMapper.fromResponseList(response.data),
        }))
      );
  }

  /**
   * Create a new role
   * Backend: POST /api/roles
   */
  createRole(data: RoleRequest): Observable<ApiResponse<Role>> {
    return this.http
      .post<ApiResponse<RoleResponse>>(`${this.api}`, data)
      .pipe(
        map((response) => ({
          ...response,
          data: RoleMapper.fromResponse(response.data),
        }))
      );
  }

  /**
   * Update an existing role (including permission assignments)
   * Backend: PUT /api/roles/{id}
   */
  updateRole(id: string, data: RoleRequest): Observable<ApiResponse<Role>> {
    return this.http
      .put<ApiResponse<RoleResponse>>(`${this.api}/${id}`, data)
      .pipe(
        map((response) => ({
          ...response,
          data: RoleMapper.fromResponse(response.data),
        }))
      );
  }

  /**
   * Delete a role
   * Backend: DELETE /api/roles/{id}
   */
  deleteRole(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/${id}`);
  }
}
