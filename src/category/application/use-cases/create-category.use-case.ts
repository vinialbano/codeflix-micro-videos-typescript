import { UseCase } from "../../../@seedwork/application/use-case";
import { Category } from "../../domain/entitites/category";
import { CategoryRepository } from "../../domain/repositories/category.repository";
import { CategoryOutput } from "./dtos/category-output.dto";
import { CategoryOutputMapper } from "./mappers/category-output.mapper";

export type Input = {
  name: string;
  description?: string;
  isActive?: boolean;
};

export type Output = CategoryOutput;

export class CreateCategoryUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly categoryRepository: CategoryRepository.Repository
  ) {}

  async execute(input: Input): Promise<Output> {
    const entity = new Category(input);
    await this.categoryRepository.insert(entity);
    return CategoryOutputMapper.toDTO(entity);
  }
}
