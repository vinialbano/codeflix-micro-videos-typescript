import { CategoryRepository } from '#category/domain';
import { UseCase as DefaultUseCase } from '#seedwork/application';
import { CategoryOutput } from './dtos';
import { CategoryOutputMapper } from './mappers';

export namespace GetCategoryUseCase {
  export type Input = {
    id: string;
  };

  export type Output = CategoryOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly categoryRepository: CategoryRepository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.categoryRepository.findById(input.id);
      return CategoryOutputMapper.toDTO(entity);
    }
  }
}
