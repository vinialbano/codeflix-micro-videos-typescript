import { UUID } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategoryModel } from "./category.model";

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
      categoryId: new UUID(model.categoryId),
      name: model.name,
      description: model.description,
      isActive: model.isActive,
      createdAt: model.createdAt,
    });
    Category.validate(entity)
    return entity
  }
}
