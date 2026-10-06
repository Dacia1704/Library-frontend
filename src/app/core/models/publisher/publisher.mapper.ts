import { Publisher } from "./publisher.model";
import { PublisherResponse } from "./response/publisher-response";

export class PublisherMapper {

  static toModel(response: PublisherResponse): Publisher {
    return {
      id: response.id,
      name: response.name,
      address: response.address ?? ''
    };
  }

  static toModelList(responses: PublisherResponse[]): Publisher[] {
    return responses.map(response => this.toModel(response));
  }
}