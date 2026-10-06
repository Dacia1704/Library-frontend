import { Author } from "@model/author/author.model";
import { Category } from "@model/category/category.model";
import { Language } from "@model/enum/language.enum";
import { Publisher } from "@model/publisher/publisher.model";
import { Shelf } from "@model/shelf/shelf.model";

export interface Book {
  id: number;
  bookCode: string;
  title: string;
  categories: Category[];
  authors: Author[];
  publishers: Publisher[];
  publishYear: number;
  cover: string;
  price: string;
  quantity: number;
  available: number;
  shelf: Shelf;
  synopsis: string;
  language: Language;
  pages: number;
  isbn: string;
  width: number;
  height: number;
  expectedReturnDate?: string;
}