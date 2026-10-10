import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { ApiResponse } from '@model/api-response';

export interface RoleResponse {
  id: number;
  name: string;
  description: string;
  permissionIds: number[];
}

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
  getRoles(): Observable<ApiResponse<RoleResponse[]>> {
    return this.http.get<ApiResponse<RoleResponse[]>>(`${this.api}`);
  }
}
