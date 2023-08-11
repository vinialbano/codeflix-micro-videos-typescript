import { UseCase } from "../../../@seedwork/application/use-case";
import { CategoryRepository } from "../../domain/repositories/category.repository";
import { CategoryOutput } from "./dtos/category-output.dto";
import { CategoryOutputMapper } from "./mappers/category-output.mapper";

export type Input = {
  id: string;
};

export type Output = CategoryOutput;

export class GetCategoryUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly categoryRepository: CategoryRepository.Repository
  ) {}

  async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepository.findById(input.id);
    return CategoryOutputMapper.toDTO(entity);
  }
}
