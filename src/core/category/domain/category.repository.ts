import { SearchableRepository } from '../../shared/domain/repository/repository';
import { SearchParams } from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';
import { Category, CategoryId } from './category.aggregate';

export type CategoryFilter = string;

export class CategorySearchParams extends SearchParams<
  Category,
  CategoryFilter
> {}

export class CategorySearchResult extends SearchResult<Category> {}

export interface CategoryRepository
  extends SearchableRepository<
    Category,
    CategoryId,
    CategoryFilter,
    CategorySearchParams,
    CategorySearchResult
  > {}
