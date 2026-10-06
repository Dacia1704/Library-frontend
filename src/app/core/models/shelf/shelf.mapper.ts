import { ShelfResponse } from "./response/shelf-response";
import { Shelf } from "./shelf.model";

export class ShelfMapper {

  static toModel(response: ShelfResponse): Shelf {
    return {
      id: response.id,
      code: response.code,
      name: response.name,
      location: response.location ?? ''
    };
  }

  static toModelList(responses: ShelfResponse[]): Shelf[] {
    return responses.map(response => this.toModel(response));
  }
}