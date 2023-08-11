import { Entity } from "../../domain/entities/entity";
import { SearchResult } from "../../domain/repositories/search-result";
import { PaginationOutputDTO } from "../dtos/pagination-output.dto";

export class PaginationOutputMapper {
  static toDTO<Item extends Entity, ItemDTO>(
    searchResult: SearchResult<Item>,
    toItemDTO: (item: Item) => ItemDTO
  ): PaginationOutputDTO<ItemDTO> {
    return {
      items: searchResult.items.map((i) => toItemDTO(i)),
      total: searchResult.total,
      currentPage: searchResult.currentPage,
      lastPage: searchResult.lastPage,
      limit: searchResult.limit,
    };
  }
}
