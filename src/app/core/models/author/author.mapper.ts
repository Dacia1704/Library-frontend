import { Author } from "./author.model";
import { AuthorResponse } from "./response/author-response";


export class AuthorMapper {

  static toModel(response: AuthorResponse): Author {
    return {
      id: response.id,
      name: response.name,
      bio: response.bio ?? ''
    };
  }

  static toModelList(responses: AuthorResponse[]): Author[] {
    return responses.map(response => this.toModel(response));
  }
}