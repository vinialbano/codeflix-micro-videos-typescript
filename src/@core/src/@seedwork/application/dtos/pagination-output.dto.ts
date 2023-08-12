export type PaginationOutputDTO<ItemDTO> = {
  items: ItemDTO[];
  total: number;
  currentPage: number;
  lastPage: number;
  limit: number;
};
