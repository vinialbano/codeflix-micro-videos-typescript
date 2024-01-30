import { EntityValidationError } from '../../../../shared/domain/errors/validation.error';
import { Category, CategoryId } from '../../../domain/category.aggregate';
import { CategoryModel } from './category.model';

export class CategoryModelMapper {
  static toModel(entity: Category): CategoryModel {
    return CategoryModel.build({
      categoryId: entity.categoryId.id,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
    });
  }

  static toEntity(model: CategoryModel): Category {
    const entity = new Category({
      categoryId: new CategoryId(model.categoryId),
      name: model.name,
      description: model.description,
      isActive: model.isActive,
      createdAt: model.createdAt,
    });
    entity.validate();
    if (entity.notification.hasErrors()) {
      throw new EntityValidationError(entity.notification.toJSON());
    }
    return entity;
  }
}
