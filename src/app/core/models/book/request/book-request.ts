export interface BookRequest {
  title: string;
  isbn: string;
  quantity: number;
  available: number;
  publishYear?: number;
  price?: number;
  cover?: File;
  categoryIds?: number[];
  authorIds?: number[];
  publisherIds?: number[];
}
