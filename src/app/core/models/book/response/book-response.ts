import { AuthorResponse } from "@model/author/response/author-response";
import { CategoryResponse } from "@model/category/response/category-response";
import { PublisherResponse } from "@model/publisher/response/publisher-response";
import { ShelfResponse } from "@model/shelf/response/shelf-response";
import { Language } from "@model/enum/language.enum";

export interface BookResponse {
  id: number;
  bookCode: string;
  title: string;
  isbn: string;
  publishYear?: number;
  price?: number;
  quantity: number;
  available: number;
  width?: number;
  height?: number;
  pages?: number;
  synopsis?: string;
  language?: Language;
  shelf?: ShelfResponse;
  cover?: string;
  categories: CategoryResponse[];
  authors: AuthorResponse[];
  publishers: PublisherResponse[];
}