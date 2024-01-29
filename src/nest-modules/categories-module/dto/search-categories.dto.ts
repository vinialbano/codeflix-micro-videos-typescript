import { ListCategoriesInput } from '@core/category/application/use-cases/list-categories/list-categories.use-case';
import { SortDirection } from '@core/shared/domain/repository/search-params';

export class SearchCategoriesDto implements ListCategoriesInput {
  page?: number;
  limit?: number;
  offset?: number;
  sort?: string;
  sortDirection?: SortDirection;
  filter?: string;
}
