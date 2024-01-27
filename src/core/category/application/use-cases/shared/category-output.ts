import { Category } from '../../../domain/category.entity';

export type CategoryOutput = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
};

export class CategoryOutputMapper {
  static toDTO(category: Category): CategoryOutput {
    const { categoryId, ...categoryProps } = category.toJSON();
    return {
      id: categoryId,
      ...categoryProps,
    };
  }
}
