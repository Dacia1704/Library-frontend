import { AuthorMapper } from "@model/author/author.mapper";
import { CategoryMapper } from "@model/category/category.mapper";
import { PublisherMapper } from "@model/publisher/publisher.mapper";
import { ShelfMapper } from "@model/shelf/shelf.mapper";
import { Language } from "@model/enum/language.enum";

import { Book } from "./book.model";
import { BookResponse } from "./response/book-response";
import { BookRequest } from "./request/book-request";

export class BookMapper {

  static toModel(response: BookResponse): Book {
    return {
      id: response.id,
      title: response.title,
      bookCode: response.bookCode,

      categories: CategoryMapper.toModelList(response.categories),
      authors: AuthorMapper.toModelList(response.authors),
      publishers: PublisherMapper.toModelList(response.publishers),

      publishYear: response.publishYear ?? 0,
      cover: response.cover ?? "",
      price: response.price?.toString() ?? "0",

      quantity: response.quantity,
      available: response.available,

      shelf: response.shelf
        ? ShelfMapper.toModel(response.shelf)
        : {
            id: 0,
            code: "",
            name: "",
            location: ""
          },

      synopsis: response.synopsis ?? "",
      language: response.language ?? Language.VI,
      pages: response.pages ?? 0,
      isbn: response.isbn,

      width: response.width ?? 0,
      height: response.height ?? 0,

      expectedReturnDate: undefined
    };
  }

  static toModelList(responses: BookResponse[]): Book[] {
    return responses.map(response => this.toModel(response));
  }

  /**
   * Convert BookRequest to FormData for API upload
   * Reusable helper used by BookService
   */
  static toFormData(data: BookRequest): FormData {
    const formData = new FormData();

    // Basic fields
    formData.append('title', data.title);
    formData.append('isbn', data.isbn);
    formData.append('quantity', data.quantity.toString());
    formData.append('available', data.available.toString());

    // Optional basic fields
    if (data.publishYear != null)
      formData.append('publishYear', data.publishYear.toString());

    if (data.price != null)
      formData.append('price', data.price.toString());

    // Cover image
    if (data.cover)
      formData.append('cover', data.cover);

    // Related entity IDs
    data.categoryIds?.forEach(id => formData.append('categoryIds', id.toString()));
    data.authorIds?.forEach(id => formData.append('authorIds', id.toString()));
    data.publisherIds?.forEach(id => formData.append('publisherIds', id.toString()));

    // Additional fields
    if (data.pages != null)
      formData.append('pages', data.pages.toString());

    if (data.synopsis != null)
      formData.append('synopsis', data.synopsis);

    if (data.language != null)
      formData.append('language', data.language);

    if (data.shelfId != null)
      formData.append('shelfId', data.shelfId.toString());

    if (data.width != null)
      formData.append('width', data.width.toString());

    if (data.height != null)
      formData.append('height', data.height.toString());

    return formData;
  }

  /**
   * Convert Book model to BookRequest for editing
   */
  static toRequest(book: Book): BookRequest {
    return {
      title: book.title,
      isbn: book.isbn,
      quantity: book.quantity,
      available: book.available,
      publishYear: book.publishYear || undefined,
      price: book.price ? parseFloat(book.price) : undefined,
      categoryIds: book.categories?.map(c => c.id),
      authorIds: book.authors?.map(a => a.id),
      publisherIds: book.publishers?.map(p => p.id),
      pages: book.pages || undefined,
      synopsis: book.synopsis || undefined,
      language: book.language,
      shelfId: book.shelf?.id || undefined,
      width: book.width || undefined,
      height: book.height || undefined,
    };
  }
}