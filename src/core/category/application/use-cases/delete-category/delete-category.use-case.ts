import { CategoryId } from '@core/category/domain/category.aggregate';
import { UseCase } from '../../../../shared/application/use-case';
import { CategoryRepository } from '../../../domain/category.repository';

export class DeleteCategoryUseCase
  implements UseCase<DeleteCategoryInput, DeleteCategoryOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: DeleteCategoryInput): Promise<DeleteCategoryOutput> {
    const id = new CategoryId(input.id);
    await this.categoryRepository.delete(id);
  }
}

export type DeleteCategoryInput = {
  id: string;
};

export type DeleteCategoryOutput = void;
