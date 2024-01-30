import { UseCase } from '../../../../shared/application/use-case';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { EntityValidationError } from '../../../../shared/domain/errors/validation.error';
import { Category, CategoryId } from '../../../domain/category.aggregate';
import { CategoryRepository } from '../../../domain/category.repository';
import {
  CategoryOutput,
  CategoryOutputMapper,
} from '../shared/category-output';
import { UpdateCategoryInput } from './update-category.input';

export class UpdateCategoryUseCase
  implements UseCase<UpdateCategoryInput, UpdateCategoryOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    const id = new CategoryId(input.id);
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError(input.id, Category);
    }
    if ('name' in input) {
      category.changeName(input.name);
    }
    if ('description' in input) {
      category.changeDescription(input.description);
    }
    if ('isActive' in input) {
      if (input.isActive) {
        category.activate();
      } else {
        category.deactivate();
      }
    }
    if (category.notification.hasErrors()) {
      throw new EntityValidationError(category.notification.toJSON());
    }
    await this.categoryRepository.update(category);
    return CategoryOutputMapper.toDTO(category);
  }
}

export type UpdateCategoryOutput = CategoryOutput;
