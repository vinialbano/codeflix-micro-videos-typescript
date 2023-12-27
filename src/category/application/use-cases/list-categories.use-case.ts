import {
  PaginationOutput,
  PaginationOutputMapper,
} from "../../../shared/application/pagination-output";
import { UseCase } from "../../../shared/application/use-case";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import { SortDirection } from "../../../shared/domain/repository/search-params";
import { UUID } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../domain/category.entity";
import {
  CategoryFilter,
  CategoryRepository,
  CategorySearchParams,
  CategorySearchResult,
} from "../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "./shared/category-output";

export class ListCategoriesUseCase
  implements UseCase<ListCategoriesInput, ListCategoriesOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: ListCategoriesInput): Promise<ListCategoriesOutput> {
    const params = new CategorySearchParams(input);
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
  sort?: string | null;
  sortDirection?: SortDirection | null;
  filter?: CategoryFilter | null;
};

export type ListCategoriesOutput = PaginationOutput<CategoryOutput>;
