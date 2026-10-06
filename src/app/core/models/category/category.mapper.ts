import { Category } from "./category.model";
import { CategoryResponse } from "./response/category-response";

export class CategoryMapper {

  static toModel(response: CategoryResponse): Category {
    return {
      id: response.id,
      name: response.name
    };
  }

  static toModelList(responses: CategoryResponse[]): Category[] {
    return responses.map(response => this.toModel(response));
  }
}