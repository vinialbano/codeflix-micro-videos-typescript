import { Category, CategoryRepository } from "#category/domain";
import {
  PaginationOutputDTO,
  PaginationOutputMapper,
  SearchInputDTO,
  UseCase,
} from "#seedwork/application";
import { EntityPropsKeys } from "#seedwork/domain";
import { CategoryOutput } from "./dtos";
import { CategoryOutputMapper } from "./mappers";

type Input = SearchInputDTO<"id" | EntityPropsKeys<Category>>;

type Output = PaginationOutputDTO<CategoryOutput>;

export class ListCategoriesUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly categoryRepository: CategoryRepository.Repository
  ) {}

  async execute(input: Input): Promise<Output> {
    const searchParams = new CategoryRepository.SearchParams(input);
    const searchResult = await this.categoryRepository.search(searchParams);
    return PaginationOutputMapper.toDTO(
      searchResult,
      CategoryOutputMapper.toDTO
    );
  }
}
