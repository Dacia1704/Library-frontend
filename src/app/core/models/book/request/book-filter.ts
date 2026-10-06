export interface BookFilter {
    keyword: string;
    isbn: string;
    maxPublishYear: number;
    minPublishYear: number;
    minQuantity: number;
    maxQuantity: number;
    minAvailable: number;
    maxAvailable: number;
    categoryIds: number[];
    authorIds: number[];
    publisherIds: number[];
}
