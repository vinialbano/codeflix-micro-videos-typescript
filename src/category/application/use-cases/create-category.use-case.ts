import { Category, CategoryRepository } from "#category/domain";
import { UseCase } from "#seedwork/application";
import { CategoryOutput } from "./dtos";
import { CategoryOutputMapper } from "./mappers";

type Input = {
  name: string;
  description?: string;
  isActive?: boolean;
};

type Output = CategoryOutput;

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
