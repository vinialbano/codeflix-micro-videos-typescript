import { Category } from '../../../domain/category.entity';
import { CategoryOutputMapper } from './category-output';

describe('CategoryOutputMapper Unit Tests', () => {
  describe('toDTO()', () => {
    it('should map a category to a category output', () => {
      const category = Category.fake().aCategory().build();
      const output = CategoryOutputMapper.toDTO(category);
      expect(output).toStrictEqual({
        id: category.categoryId.id,
        name: category.name,
        description: category.description,
        isActive: category.isActive,
        createdAt: category.createdAt,
      });
    });
  });
});
