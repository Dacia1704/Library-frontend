import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "@environments/environment";
import { ApiResponse, PageResponse } from "@model/api-response";
import { Member } from "@model/member/member.model";
import { MemberResponse } from "@model/member/response/member-response";
import { MemberMapper } from "@model/member/member.mapper";
import { MemberPaymentResponse } from "@model/member/response/member-payment-response";

@Injectable({
  providedIn: 'root'
})
export class MemberPaymentService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/member-payments`;

  getMe(
      month: number | null,
      page: number,
      size: number
    ): Observable<ApiResponse<PageResponse<MemberPaymentResponse>>> {
      const monthParam = month !== null ? `month=${month}` : '';
      return this.http.get<ApiResponse<PageResponse<MemberPaymentResponse>>>(`${this.api}/me?${monthParam}&page=${page}&size=${size}`);
    }
}
