import { PaginationOutputDTO } from "../../../@seedwork/application/dtos/pagination-output.dto";
import { SearchInputDTO } from "../../../@seedwork/application/dtos/search-input.dto";
import { PaginationOutputMapper } from "../../../@seedwork/application/mappers/pagination-output.mapper";
import { UseCase } from "../../../@seedwork/application/use-case";
import { EntityPropsKeys } from "../../../@seedwork/domain/entities/entity";
import { Category } from "../../domain/entitites/category";
import { CategoryRepository } from "../../domain/repositories/category.repository";
import { CategoryOutput } from "./dtos/category-output.dto";
import { CategoryOutputMapper } from "./mappers/category-output.mapper";

export type Input = SearchInputDTO<"id" | EntityPropsKeys<Category>>;

export type Output = PaginationOutputDTO<CategoryOutput>;

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
