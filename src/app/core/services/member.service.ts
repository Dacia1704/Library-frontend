import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { ApiResponse, PageResponse } from '@model/api-response';
import { Member } from '@model/member/member.model';
import { MemberResponse } from '@model/member/response/member-response';
import { MemberMapper } from '@model/member/member.mapper';
import { MemberRequest } from '@model/member/request/member-request';
import { MemberCreateRequest } from '@model/member/request/member-create-request';
import { MemberRenewRequest } from '@model/member/request/member-renew-request';
import { CreateUserMemberRequest } from '@model/member/request/create-user-member-request';
import { MemberFilter } from '@model/member/request/member-filter';
import { User } from '@model/user/user.model';
import { UserResponse } from '@model/user/response/user-response';
import { UserMapper } from '@model/user/user.mapper';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/members`;

  // ===== Current Member (MEMBER role) =====

  getMe(): Observable<ApiResponse<Member>> {
    return this.http
      .get<ApiResponse<MemberResponse>>(`${this.api}/me`)
      .pipe(
        map(response => ({
          ...response,
          data: MemberMapper.fromResponse(response.data),
        }))
      );
  }

  // ===== Librarian: Full member management =====

  /**
   * Get all members (flat list)
   */
  getMembers(): Observable<ApiResponse<Member[]>> {
    return this.http
      .get<ApiResponse<MemberResponse[]>>(`${this.api}`)
      .pipe(
        map(response => ({
          ...response,
          data: MemberMapper.fromResponseList(response.data),
        }))
      );
  }

  /**
   * Get members with pagination and optional filter
   * Backend: GET /members/pagination?page=&size=&keyword=
   */
  getPagination(
    filter: MemberFilter,
    page: number,
    size: number
  ): Observable<ApiResponse<PageResponse<Member>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (filter.keyword) {
      params.append('keyword', filter.keyword);
    }

    return this.http
      .get<ApiResponse<PageResponse<MemberResponse>>>(
        `${this.api}/pagination?${params.toString()}`
      )
      .pipe(
        map(response => ({
          ...response,
          data: {
            ...response.data,
            data: MemberMapper.fromResponseList(response.data.data),
          },
        }))
      );
  }

  /**
   * Get member by id
   */
  getById(id: number): Observable<ApiResponse<Member>> {
    return this.http
      .get<ApiResponse<MemberResponse>>(`${this.api}/${id}`)
      .pipe(
        map(response => ({
          ...response,
          data: MemberMapper.fromResponse(response.data),
        }))
      );
  }

  /**
   * Get deleted member by id (soft-deleted record)
   */
  getDeleted(id: number): Observable<ApiResponse<Member>> {
    return this.http
      .get<ApiResponse<MemberResponse>>(`${this.api}/deleted/${id}`)
      .pipe(
        map(response => ({
          ...response,
          data: MemberMapper.fromResponse(response.data),
        }))
      );
  }

  // ===== Member creation =====

  /**
   * Create member for an EXISTING user (user already registered)
   * Flow: Librarian creates user first, then issues member card
   */
  createMember(data: MemberCreateRequest): Observable<ApiResponse<Member>> {
    return this.http
      .post<ApiResponse<MemberResponse>>(`${this.api}`, data)
      .pipe(
        map(response => ({
          ...response,
          data: MemberMapper.fromResponse(response.data),
        }))
      );
  }

  /**
   * Register a new reader (creates BOTH user account + member card in one step)
   * Flow: Librarian fills full info → system auto-creates user + member
   */
  registerUserAndMember(
    request: CreateUserMemberRequest
  ): Observable<ApiResponse<Member>> {
    return this.http
      .post<ApiResponse<MemberResponse>>(`${this.api}/register`, request)
      .pipe(
        map(response => ({
          ...response,
          data: MemberMapper.fromResponse(response.data),
        }))
      );
  }

  // ===== Member lifecycle =====

  /**
   * Renew / extend member card expiry (with optional payment)
   */
  renewMember(
    id: number,
    request: MemberRenewRequest
  ): Observable<ApiResponse<Member>> {
    return this.http
      .post<ApiResponse<MemberResponse>>(`${this.api}/${id}/renew`, request)
      .pipe(
        map(response => ({
          ...response,
          data: MemberMapper.fromResponse(response.data),
        }))
      );
  }

  /**
   * Update member info (phone, address, identity number, card status...)
   */
  updateMember(id: number, data: MemberRequest): Observable<ApiResponse<Member>> {
    return this.http
      .put<ApiResponse<MemberResponse>>(`${this.api}/${id}`, data)
      .pipe(
        map(response => ({
          ...response,
          data: MemberMapper.fromResponse(response.data),
        }))
      );
  }

  /**
   * Soft-delete a member
   */
  deleteMember(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/${id}`);
  }

  // ===== User-level operations =====

  /**
   * Activate / deactivate user account (lock/unlock)
   */
  setUserActive(userId: number, isActive: boolean): Observable<ApiResponse<User>> {
    return this.http
      .put<ApiResponse<UserResponse>>(
        `${environment.apiUrl}/users/${userId}/active`,
        { isActive }
      )
      .pipe(
        map(response => ({
          ...response,
          data: UserMapper.fromResponse(response.data),
        }))
      );
  }
}
