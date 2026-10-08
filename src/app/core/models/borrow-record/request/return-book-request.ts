import { FineReason } from "@model/enum/fine-reason.enum";

export interface FineRequest {
  reason: FineReason;
  note?: string;
  attachment?: File;
}

export interface ReturnBookRequest {
  fineRequests: FineRequest[];
}