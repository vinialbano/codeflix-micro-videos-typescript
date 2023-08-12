import { PaginationOutputDTO } from '../dtos';
import { Entity, SearchResult } from '#seedwork/domain';

export class PaginationOutputMapper {
  static toDTO<Item extends Entity, ItemDTO>(
    searchResult: SearchResult<Item>,
    toItemDTO: (item: Item) => ItemDTO,
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
