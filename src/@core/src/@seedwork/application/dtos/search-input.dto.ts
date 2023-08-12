type SortOrder = 'asc' | 'desc';

export type SearchInputDTO<SortProps = string, Filter = string> = {
  page?: number;
  limit?: number;
  sort?: SortProps | null;
  order?: SortOrder | null;
  filter?: Filter | null;
};
