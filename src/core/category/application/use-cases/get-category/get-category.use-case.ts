import { UseCase } from '../../../../shared/application/use-case';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Category, CategoryId } from '../../../domain/category.aggregate';
import { CategoryRepository } from '../../../domain/category.repository';
import {
  CategoryOutput,
  CategoryOutputMapper,
} from '../shared/category-output';

export class GetCategoryUseCase
  implements UseCase<GetCategoryInput, GetCategoryOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
    const id = new CategoryId(input.id);
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError(input.id, Category);
    }
    return CategoryOutputMapper.toDTO(category);
  }
}

export type GetCategoryInput = {
  id: string;
};

export type GetCategoryOutput = CategoryOutput;
