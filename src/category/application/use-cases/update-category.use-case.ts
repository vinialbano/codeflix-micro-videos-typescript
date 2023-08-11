import { UseCase } from "../../../@seedwork/application/use-case";
import { CategoryRepository } from "../../domain/repositories/category.repository";
import { CategoryOutput } from "./dtos/category-output.dto";
import { CategoryOutputMapper } from "./mappers/category-output.mapper";

export type Input = {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
};

export type Output = CategoryOutput;

export class UpdateCategoryUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly categoryRepository: CategoryRepository.Repository
  ) {}

  async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepository.findById(input.id);
    entity.update(input.name, input.description);
    if (input.isActive === true) {
      entity.activate();
    }
    if (input.isActive === false) {
      entity.deactivate();
    }
    await this.categoryRepository.update(entity);
    return CategoryOutputMapper.toDTO(entity);
  }
}
