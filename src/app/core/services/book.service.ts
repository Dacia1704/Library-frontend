import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { map, Observable } from "rxjs";
import { environment } from "@environments/environment";
import { ApiResponse, PageResponse } from "@model/api-response";
import { BookRequest } from "@model/book/request/book-request";
import { BookResponse } from "@model/book/response/book-response";
import { BookFilter } from "@model/book/request/book-filter";
import { BookMapper } from "@model/book/book.mapper";
import { Book } from "@model/book/book.model";

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private api = `${environment.apiUrl}/books`;

  create(data: BookRequest): Observable<ApiResponse<BookResponse>> {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('isbn', data.isbn);
    formData.append('quantity', data.quantity.toString());
    formData.append('available', data.available.toString());

    if (data.publishYear != null)
      formData.append('publishYear', data.publishYear.toString());

    if (data.price != null)
      formData.append('price', data.price.toString());

    if (data.cover)
      formData.append('cover', data.cover);

    data.categoryIds?.forEach(id => formData.append('categoryIds', id.toString())); 
    data.authorIds?.forEach(id => formData.append('authorIds', id.toString()));
    data.publisherIds?.forEach(id => formData.append('publisherIds', id.toString()));

    return this.http.post<ApiResponse<BookResponse>>(this.api, formData);
  }

  getPagination(
    filter: BookFilter,
    page: number,
    size: number
  ): Observable<ApiResponse<PageResponse<Book>>> {

    return this.http
      .post<ApiResponse<PageResponse<BookResponse>>>(
        `${this.api}/pagination?page=${page}&size=${size}`,
        filter
      )
      .pipe(
        map(response => ({
          ...response,
          data: {
            ...response.data,
            data: BookMapper.toModelList(response.data.data)
          }
        }))
      );
  }

  getById(id: number): Observable<ApiResponse<Book>> {
    return this.http.get<ApiResponse<BookResponse>>(`${this.api}/${id}`)
    .pipe(
      map(response => ({
          ...response,
          data: BookMapper.toModel(response.data)
        }))
    );
  }
}
