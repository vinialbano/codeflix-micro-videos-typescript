import { UseCase } from '../../../../shared/application/use-case';
import { EntityValidationError } from '../../../../shared/domain/errors/validation.error';
import { Category } from '../../../domain/category.aggregate';
import { CategoryRepository } from '../../../domain/category.repository';
import {
  CategoryOutput,
  CategoryOutputMapper,
} from '../shared/category-output';
import { CreateCategoryInput } from './create-category.input';

export class CreateCategoryUseCase
  implements UseCase<CreateCategoryInput, CreateCategoryOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const category = Category.create(input);
    if (category.notification.hasErrors()) {
      throw new EntityValidationError(category.notification.toJSON());
    }
    await this.categoryRepository.insert(category);
    return CategoryOutputMapper.toDTO(category);
  }
}

export type CreateCategoryOutput = CategoryOutput;
