import { AuthorMapper } from "@model/author/author.mapper";
import { CategoryMapper } from "@model/category/category.mapper";
import { PublisherMapper } from "@model/publisher/publisher.mapper";
import { ShelfMapper } from "@model/shelf/shelf.mapper";
import { Language } from "@model/enum/language.enum";

import { Book } from "./book.model";
import { BookResponse } from "./response/book-response";

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
}