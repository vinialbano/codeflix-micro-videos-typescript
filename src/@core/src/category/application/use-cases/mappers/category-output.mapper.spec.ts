import { CategoryOutputMapper } from '#category/application';
import { Category } from '#category/domain';

describe('CategoryOutputMapper Unit Tests', () => {
  describe('toDTO()', () => {
    it('should map a Category to a CategoryOutputDTO', () => {
      const category = new Category({
        name: 'A name',
        description: 'A description',
      });
      const result = CategoryOutputMapper.toDTO(category);
      expect(result).toStrictEqual({
        id: category.id,
        name: category.name,
        description: category.description,
        isActive: category.isActive,
        createdAt: category.createdAt,
      });
    });
  });
});
