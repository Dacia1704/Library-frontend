import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { ApiResponse, PageResponse } from '@model/api-response';
import { User } from '@model/user/user.model';
import { UserResponse } from '@model/user/response/user-response';
import { UserMapper } from '@model/user/user.mapper';
import { UserFilter } from '@model/user/request/user-filter';
import { UserRequest } from '@model/user/request/user-request';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/users`;

  /**
   * Get users with pagination and optional filter
   * Backend: GET /api/users?page=&size=&keyword=&email=&roleId=&isMember=&phone=
   */
  getUsers(
    filter: UserFilter,
    page: number,
    size: number
  ): Observable<ApiResponse<PageResponse<User>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (filter.keyword) {
      params.append('keyword', filter.keyword);
    }
    if (filter.email) {
      params.append('email', filter.email);
    }
    if (filter.roleId !== undefined && filter.roleId !== null) {
      params.append('roleId', filter.roleId.toString());
    }
    if (filter.isMember !== undefined && filter.isMember !== null) {
      params.append('isMember', filter.isMember.toString());
    }
    if (filter.phone) {
      params.append('phone', filter.phone);
    }

    return this.http
      .get<ApiResponse<PageResponse<UserResponse>>>(
        `${this.api}?${params.toString()}`
      )
      .pipe(
        map(response => ({
          ...response,
          data: {
            ...response.data,
            data: UserMapper.fromResponseList(response.data.data),
          },
        }))
      );
  }

  /**
   * Create a new user
   * Backend: POST /api/users
   */
  createUser(request: UserRequest): Observable<ApiResponse<User>> {
    return this.http
      .post<ApiResponse<UserResponse>>(`${this.api}`, request)
      .pipe(
        map(response => ({
          ...response,
          data: UserMapper.fromResponse(response.data),
        }))
      );
  }

  /**
   * Update an existing user
   * Backend: PUT /api/users/{id}
   */
  updateUser(userId: number, request: UserRequest): Observable<ApiResponse<User>> {
    return this.http
      .put<ApiResponse<UserResponse>>(`${this.api}/${userId}`, request)
      .pipe(
        map(response => ({
          ...response,
          data: UserMapper.fromResponse(response.data),
        }))
      );
  }

  /**
   * Toggle user active status
   */
  setUserActive(userId: number, isActive: boolean): Observable<ApiResponse<User>> {
    return this.http
      .put<ApiResponse<UserResponse>>(
        `${this.api}/${userId}/active`,
        { isActive }
      )
      .pipe(
        map(response => ({
          ...response,
          data: UserMapper.fromResponse(response.data),
        }))
      );
  }

  /**
   * Delete user (soft delete)
   */
  deleteUser(userId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/${userId}`);
  }
}
