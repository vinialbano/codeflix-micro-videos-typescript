import { Category } from "../../../domain/entitites/category";
import { CategoryOutput } from "../dtos/category-output.dto";

export class CategoryOutputMapper {
  static toDTO(category: Category): CategoryOutput {
    return category.toJSON();
  }
}
