import { CategoryRepository } from "#category/domain";
import { UseCase } from "#seedwork/application";
import { CategoryOutput } from "./dtos";
import { CategoryOutputMapper } from "./mappers";

type Input = {
  id: string;
};

type Output = CategoryOutput;

export class GetCategoryUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly categoryRepository: CategoryRepository.Repository
  ) {}

  async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepository.findById(input.id);
    return CategoryOutputMapper.toDTO(entity);
  }
}
