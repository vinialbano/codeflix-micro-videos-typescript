import { CategoryRepository } from '#category/domain';
import { UseCase as DefaultUseCase } from '#seedwork/application';

export namespace DeleteCategoryUseCase {
  export type Input = {
    id: string;
  };

  export type Output = void;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly categoryRepository: CategoryRepository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      await this.categoryRepository.delete(input.id);
    }
  }
}
