import { Category } from '../../../domain/category.aggregate';
import { CategoryInMemoryRepository } from './category-in-memory.repository';

describe('CategoryInMemoryRepository', () => {
  describe('getEntity()', () => {
    it('should return Category', () => {
      const repository = new CategoryInMemoryRepository();
      expect(repository.getEntity()).toEqual(Category);
    });
  });

  describe('applyFilter()', () => {
    it('should return all items if filter is null', async () => {
      const repository = new CategoryInMemoryRepository();
      const items = Category.fake().someCategories(3).build();
      const filteredItems = await repository['applyFilter'](items, null);
      expect(filteredItems).toEqual(items);
    });

    it('should return filtered items by name', async () => {
      const repository = new CategoryInMemoryRepository();
      const items = Category.fake()
        .someCategories(3)
        .withName((i) => `Name ${i + 1}`)
        .build();
      const filteredItems = await repository['applyFilter'](items, '2');
      expect(filteredItems).toEqual([items[1]]);
    });
  });

  describe('applySort()', () => {
    it('should sort by createdAt desc if sortCriteria is not set', () => {
      const repository = new CategoryInMemoryRepository();
      const date = new Date();
      const items = Category.fake()
        .someCategories(3)
        .withCreatedAt((i) => new Date(date.getTime() + i * 1000))
        .build();
      const sortedItems = repository['applySort'](items);
      expect(sortedItems).toEqual([items[2], items[1], items[0]]);
    });

    it('should sort using the given parameters', async () => {
      const repository = new CategoryInMemoryRepository();
      const items = Category.fake()
        .someCategories(3)
        .withName((i) => `Name ${i + 1}`)
        .build();
      const sortedItems = repository['applySort'](items, {
        field: 'name',
        direction: 'desc',
      });
      expect(sortedItems).toEqual([items[2], items[1], items[0]]);

      const sortedItems2 = repository['applySort'](items, {
        field: 'name',
        direction: 'asc',
      });
      expect(sortedItems2).toEqual([items[0], items[1], items[2]]);
    });
  });
});
