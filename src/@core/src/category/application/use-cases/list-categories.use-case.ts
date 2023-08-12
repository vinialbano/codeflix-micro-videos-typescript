import { Category, CategoryRepository } from '#category/domain';
import {
  UseCase as DefaultUseCase,
  PaginationOutputDTO,
  PaginationOutputMapper,
  SearchInputDTO,
} from '#seedwork/application';
import { EntityPropsKeys } from '#seedwork/domain';
import { CategoryOutput } from './dtos';
import { CategoryOutputMapper } from './mappers';

export namespace ListCategoriesUseCase {
  export type Input = SearchInputDTO<'id' | EntityPropsKeys<Category>>;

  export type Output = PaginationOutputDTO<CategoryOutput>;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly categoryRepository: CategoryRepository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const searchParams = new CategoryRepository.SearchParams(input);
      const searchResult = await this.categoryRepository.search(searchParams);
      return PaginationOutputMapper.toDTO(
        searchResult,
        CategoryOutputMapper.toDTO,
      );
    }
  }
}
