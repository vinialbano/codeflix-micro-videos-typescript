import { Category } from '#category/domain';
import {
  EntityLoadError,
  EntityValidationError,
  UniqueEntityID,
} from '#seedwork/domain';
import { CategoryModel } from './category-model';

export class CategoryModelMapper {
  static toEntity(model: CategoryModel) {
    const { id, ...otherData } = model.toJSON();
    try {
      return new Category({ ...otherData }, new UniqueEntityID(id));
    } catch (e) {
      if (e instanceof EntityValidationError) {
        throw new EntityLoadError(e.errors);
      }
      throw e;
    }
  }
}
