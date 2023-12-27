import { UseCase } from "../../../shared/application/use-case";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import { UUID } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../domain/category.entity";
import { CategoryRepository } from "../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "./shared/category-output";

export class GetCategoryUseCase
  implements UseCase<GetCategoryInput, GetCategoryOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
    const uuid = new UUID(input.id);
    const category = await this.categoryRepository.findById(uuid);
    if (!category) {
      throw new NotFoundError(input.id, Category);
    }
    return CategoryOutputMapper.toDTO(category);
  }
}

export type GetCategoryInput = {
  id: string;
  name?: string;
  description?: string | null;
  isActive?: boolean;
};

export type GetCategoryOutput = CategoryOutput;
