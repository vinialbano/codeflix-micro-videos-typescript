import { Category } from '../../../domain/category.aggregate';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '../../../../shared/application/pagination-output';
import { UseCase } from '../../../../shared/application/use-case';
import { SortCriterion } from '../../../../shared/domain/repository/search-params';

import {
  CategoryFilter,
  CategoryRepository,
  CategorySearchParams,
  CategorySearchResult,
} from '../../../domain/category.repository';
import {
  CategoryOutput,
  CategoryOutputMapper,
} from '../shared/category-output';

export class ListCategoriesUseCase
  implements UseCase<ListCategoriesInput, ListCategoriesOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: ListCategoriesInput): Promise<ListCategoriesOutput> {
    const params = new CategorySearchParams({
      ...(input.page && { page: input.page }),
      ...(input.limit && { limit: input.limit }),
      ...(input.filter && { filter: input.filter }),
      ...(input.sortCriteria && { sortCriteria: input.sortCriteria }),
    });
    const searchResult = await this.categoryRepository.search(params);
    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: CategorySearchResult) {
    const items = searchResult.items.map((i) => CategoryOutputMapper.toDTO(i));
    return PaginationOutputMapper.toDTO(items, searchResult);
  }
}

export type ListCategoriesInput = {
  page?: number;
  limit?: number;
  sortCriteria?: SortCriterion<Category> | SortCriterion<Category>[];
  filter?: CategoryFilter | null;
};

export type ListCategoriesOutput = PaginationOutput<CategoryOutput>;
