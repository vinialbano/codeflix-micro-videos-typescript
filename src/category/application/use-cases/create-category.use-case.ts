import { UseCase } from "../../../shared/application/use-case";
import { Category } from "../../domain/category.entity";
import { CategoryRepository } from "../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "./shared/category-output";

export class CreateCategoryUseCase
  implements UseCase<CreateCategoryInput, CreateCategoryOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const category = Category.create(input);
    await this.categoryRepository.insert(category);
    return CategoryOutputMapper.toDTO(category);
  }
}

export type CreateCategoryInput = {
  name: string;
  description?: string | null;
  isActive?: boolean;
};

export type CreateCategoryOutput = CategoryOutput;
