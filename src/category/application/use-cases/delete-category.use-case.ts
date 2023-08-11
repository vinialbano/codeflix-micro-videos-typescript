import { UseCase } from "../../../@seedwork/application/use-case";
import { CategoryRepository } from "../../domain/repositories/category.repository";

export type Input = {
  id: string;
};

export type Output = void;

export class DeleteCategoryUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly categoryRepository: CategoryRepository.Repository
  ) {}

  async execute(input: Input): Promise<Output> {
    await this.categoryRepository.delete(input.id);
  }
}
