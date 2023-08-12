import { CategoryRepository } from '#category/domain';
import { UseCase as DefaultUseCase } from '#seedwork/application';
import { CategoryOutput } from './dtos';
import { CategoryOutputMapper } from './mappers';

export namespace UpdateCategoryUseCase {
  export type Input = {
    id: string;
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
}
