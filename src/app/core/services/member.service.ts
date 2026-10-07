import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "@environments/environment";
import { ApiResponse, PageResponse } from "@model/api-response";
import { Book } from "@model/book/book.model";
import { Member } from "@model/member/member.model";
import { MemberResponse } from "@model/member/response/member-response";
import { MemberMapper } from "@model/member/member.mapper";

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/members`;

  getMe(): Observable<ApiResponse<Member>> {
    return this.http.get<ApiResponse<MemberResponse>>(`${this.api}/me`)
    .pipe(
      map(response => ({
          ...response,
          data: MemberMapper.fromResponse(response.data)
        }))
    );
  }
}
