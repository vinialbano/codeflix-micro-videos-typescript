import { Category } from "#category/domain";
import { CategoryOutput } from "../dtos";

export class CategoryOutputMapper {
  static toDTO(category: Category): CategoryOutput {
    return category.toJSON();
  }
}
