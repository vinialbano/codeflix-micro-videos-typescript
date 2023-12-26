import {
  Repository,
  SearchableRepository,
} from "../../shared/domain/repository/repository";
import { SearchParams } from "../../shared/domain/repository/search-params";
import { SearchResult } from "../../shared/domain/repository/search-result";
import { UUID } from "../../shared/domain/value-objects/uuid.vo";
import { Category } from "./category.entity";

export type CategoryFilter = string;

export class CategorySearchParams extends SearchParams<CategoryFilter> {}

export class CategorySearchResult extends SearchResult<Category> {}

export interface CategoryRepository
  extends SearchableRepository<
    Category,
    UUID,
    CategoryFilter,
    CategorySearchParams,
    CategorySearchResult
  > {}
