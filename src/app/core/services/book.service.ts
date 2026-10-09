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

  // ===== Create / Update =====

  /**
   * Create a new book
   * Backend: POST /books (multipart/form-data)
   * Requires: BOOK_WRITE authority
   */
  create(data: BookRequest): Observable<ApiResponse<BookResponse>> {
    const formData = this.buildFormData(data);

    return this.http.post<ApiResponse<BookResponse>>(this.api, formData);
  }

  /**
   * Update an existing book
   * Backend: PUT /books/{id} (multipart/form-data)
   * Requires: BOOK_WRITE authority
   */
  updateBook(
    id: string,
    data: BookRequest
  ): Observable<ApiResponse<BookResponse>> {
    const formData = this.buildFormData(data);

    return this.http.put<ApiResponse<BookResponse>>(
      `${this.api}/${id}`,
      formData
    );
  }

  /**
   * Restore a deleted book
   * Backend: PUT /books/{id}/restore (multipart/form-data)
   * Requires: BOOK_WRITE authority
   */
  restoreBook(
    id: string,
    data: BookRequest
  ): Observable<ApiResponse<BookResponse>> {
    const formData = this.buildFormData(data);

    return this.http.put<ApiResponse<BookResponse>>(
      `${this.api}/${id}/restore`,
      formData
    );
  }

  // ===== Read =====

  /**
   * Get paginated book list with filter
   * Backend: POST /books/pagination?page=&size=
   */
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

  /**
   * Get a book by id
   * Backend: GET /books/{id}
   */
  getById(id: string): Observable<ApiResponse<Book>> {
    return this.http
      .get<ApiResponse<BookResponse>>(`${this.api}/${id}`)
      .pipe(
        map(response => ({
          ...response,
          data: BookMapper.toModel(response.data)
        }))
      );
  }

  /**
   * Get a soft-deleted book by id
   * Backend: GET /books/deleted/{id}
   * Requires: BOOK_WRITE authority
   */
  getBookDeleted(id: string): Observable<ApiResponse<Book>> {
    return this.http
      .get<ApiResponse<BookResponse>>(`${this.api}/deleted/${id}`)
      .pipe(
        map(response => ({
          ...response,
          data: BookMapper.toModel(response.data)
        }))
      );
  }

  /**
   * Get all books (flat list, optional keyword search)
   * Backend: GET /books?keyword=
   */
  getBooks(keyword?: string): Observable<ApiResponse<Book[]>> {
    let url = this.api;
    if (keyword) {
      const params = new URLSearchParams({ keyword });
      url = `${this.api}?${params.toString()}`;
    }

    return this.http
      .get<ApiResponse<BookResponse[]>>(url)
      .pipe(
        map(response => ({
          ...response,
          data: BookMapper.toModelList(response.data)
        }))
      );
  }

  // ===== Delete =====

  /**
   * Soft-delete a book
   * Backend: DELETE /books/{id}
   * Requires: BOOK_WRITE authority AND ADMIN role
   */
  deleteBook(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.api}/${id}`);
  }

  // ===== Helpers =====

  private buildFormData(data: BookRequest): FormData {
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

    return formData;
  }
}
