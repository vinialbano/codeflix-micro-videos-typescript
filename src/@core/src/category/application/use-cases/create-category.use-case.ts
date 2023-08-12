import { Category, CategoryRepository } from '#category/domain';
import { UseCase as DefaultUseCase } from '#seedwork/application';
import { CategoryOutput } from './dtos';
import { CategoryOutputMapper } from './mappers';

export namespace CreateCategoryUseCase {
  export type Input = {
    name: string;
    description?: string;
    isActive?: boolean;
  };

  export type Output = CategoryOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly categoryRepository: CategoryRepository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const entity = new Category(input);
      await this.categoryRepository.insert(entity);
      return CategoryOutputMapper.toDTO(entity);
    }
  }
}
