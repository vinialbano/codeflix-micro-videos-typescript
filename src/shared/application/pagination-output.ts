import { SearchResult } from "../domain/repository/search-result";

export type PaginationOutput<Item = any> = {
  items: Item[];
  total: number;
  currentPage: number;
  lastPage: number;
  limit: number;
};

export class PaginationOutputMapper {
  static toDTO<Item = any>(
    items: Item[],
    props: Omit<SearchResult, "items">
  ): PaginationOutput<Item> {
    return {
      items,
      total: props.total,
      currentPage: props.currentPage,
      lastPage: props.lastPage,
      limit: props.limit,
    };
  }
}
