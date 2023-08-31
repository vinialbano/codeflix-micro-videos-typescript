import { Category, CategoryRepository } from '#category/domain';
import { CategoryTestBuilder } from '#category/domain/entitites/category.test-builder';
import { EntityLoadError, NotFoundError } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/tests';
import { Chance } from 'chance';
import { CategoryModel } from '../category-model';
import { CategorySequelizeRepository } from '../category-sequelize.repository';

const makeInvalidCategoryProps = () => {
  const builder = CategoryTestBuilder.aCategory()
    .withInvalidNameIsTooShort()
    .active()
    .withCreatedAt(new Date());

  return {
    id: Chance().guid({ version: 4 }),
    name: builder.name,
    isActive: builder.isActive,
    createdAt: new Date(),
  };
};

describe('CategorySequelizeRepository Integration Tests', () => {
  setupSequelize({
    models: [CategoryModel],
  });

  let repository: CategorySequelizeRepository;
  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  describe('insert()', () => {
    it('should insert a new category', async () => {
      const builder = CategoryTestBuilder.aCategory();
      const arrange: any[] = [
        builder.build(),
        builder.withDescription(null).build(),
        builder.inactive().build(),
      ];
      for (const category of arrange) {
        await repository.insert(category);
        const model = await CategoryModel.findByPk(category.id);
        expect(model!.toJSON()).toStrictEqual(category.toJSON());
      }
    });
  });

  describe('insertMany()', () => {
    it('should insert many categories', async () => {
      const builder = CategoryTestBuilder.aCategory();
      const arrange: Category[] = [
        builder.build(),
        builder.withDescription(null).build(),
        builder.inactive().build(),
      ];
      await repository.insertMany(arrange);
      const models = await CategoryModel.findAll();
      expect(models.length).toBe(arrange.length);
      for (const model of models) {
        const category: Category = arrange.find((c) => c.id === model.id)!;
        expect(model.toJSON()).toStrictEqual(category.toJSON());
      }
    });
  });

  describe('findById()', () => {
    it('should throw an error if category not found', async () => {
      await expect(repository.findById('1')).rejects.toThrowError(
        new NotFoundError('Entity not found using ID 1'),
      );
    });

    it('should find a category by id', async () => {
      const category = CategoryTestBuilder.aCategory().build();
      await repository.insert(category);
      const result = await repository.findById(category.id);
      expect(result).toStrictEqual(category);
    });
  });

  describe('findAll()', () => {
    it('should throw an error if a category is not valid', async () => {
      await CategoryModel.create(makeInvalidCategoryProps());
      await expect(repository.findAll()).rejects.toThrowError(EntityLoadError);
    });

    it('should return an empty array if no categories are found', async () => {
      const result = await repository.findAll();
      expect(result).toStrictEqual([]);
    });

    it('should return all categories', async () => {
      const builder = CategoryTestBuilder.aCategory();
      const categories: Category[] = [
        builder.build(),
        builder.withDescription(null).build(),
        builder.inactive().build(),
      ];
      await repository.insertMany(categories);
      const result = await repository.findAll();
      expect(result).toStrictEqual(categories);
    });
  });

  describe('update()', () => {
    it('should throw an error if category not found', async () => {
      const category = CategoryTestBuilder.aCategory().build();
      await expect(repository.update(category)).rejects.toThrowError(
        new NotFoundError(`Entity not found using ID ${category.id}`),
      );
    });

    it('should throw an error if category is not valid', async () => {
      const category = CategoryTestBuilder.aCategory().build();
      const invalidProps = makeInvalidCategoryProps();
      await CategoryModel.create({
        ...invalidProps,
        id: category.id,
      });
      await expect(repository.update(category)).rejects.toThrowError(
        EntityLoadError,
      );
    });

    it('should update a category', async () => {
      const category = CategoryTestBuilder.aCategory().build();
      await repository.insert(category);
      category.update('New name', 'New description');
      await repository.update(category);
      const result = await repository.findById(category.id);
      expect(result).toStrictEqual(category);
    });
  });

  describe('delete()', () => {
    it('should throw an error if category not found', async () => {
      await expect(repository.delete('1')).rejects.toThrowError(
        new NotFoundError('Entity not found using ID 1'),
      );
    });

    it('should throw an error if category is not valid', async () => {
      const invalidProps = makeInvalidCategoryProps();
      await CategoryModel.create(invalidProps);
      await expect(repository.delete(invalidProps.id)).rejects.toThrowError(
        EntityLoadError,
      );
    });

    it('should delete a category', async () => {
      const category = CategoryTestBuilder.aCategory().build();
      await repository.insert(category);
      await repository.delete(category.id);
      await expect(repository.findById(category.id)).rejects.toThrowError(
        new NotFoundError(`Entity not found using ID ${category.id}`),
      );
    });
  });

  describe('search()', () => {
    it('should throw an error if a category is not valid', async () => {
      await CategoryModel.create(makeInvalidCategoryProps());
      await expect(repository.search()).rejects.toThrowError(EntityLoadError);
    });

    it('should return an empty array if no categories are found', async () => {
      const result = await repository.search();
      expect(result).toStrictEqual(
        new CategoryRepository.SearchResult({
          items: [],
          total: 0,
          currentPage: 1,
          limit: 15,
          filter: null,
          order: null,
          sort: null,
        }),
      );
    });

    it('should return paginated categories ordered by `createdAt` when other params are not provided', async () => {
      const categories = CategoryTestBuilder.manyCategories(20).build();
      await repository.insertMany(categories);
      categories.sort((a, b) => {
        if (a.createdAt < b.createdAt) return 1;
        if (a.createdAt > b.createdAt) return -1;
        return 0;
      });
      const arrange = [
        {
          given: undefined,
          expected: {
            items: categories.slice(0, 15),
            currentPage: 1,
            limit: 15,
          },
        },
        {
          given: { page: 2 },
          expected: {
            items: categories.slice(15),
            currentPage: 2,
            limit: 15,
          },
        },
        {
          given: { page: 2, limit: 8 },
          expected: {
            items: categories.slice(8, 16),
            currentPage: 2,
            limit: 8,
          },
        },
      ];
      for (const item of arrange) {
        const result = await repository.search(
          new CategoryRepository.SearchParams(item.given),
        );
        expect(result).toStrictEqual(
          new CategoryRepository.SearchResult({
            total: 20,
            filter: null,
            order: null,
            sort: null,
            ...item.expected,
          }),
        );
      }
    });

    it('should return paginated categories ordered by `createdAt` when an invalid sort is provided', async () => {
      const categories = CategoryTestBuilder.manyCategories(20).build();
      await repository.insertMany(categories);
      categories.sort((a, b) => {
        if (a.createdAt < b.createdAt) return 1;
        if (a.createdAt > b.createdAt) return -1;
        return 0;
      });
      const arrange: any[] = [
        {
          given: { sort: 'any', order: 'asc' },
          expected: {
            items: categories.slice(0, 15),
            currentPage: 1,
            limit: 15,
          },
        },
        {
          given: { sort: 'any', order: 'desc' },
          expected: {
            items: categories.slice(0, 15),
            currentPage: 1,
            limit: 15,
          },
        },
      ];
      for (const item of arrange) {
        const result = await repository.search(
          new CategoryRepository.SearchParams(item.given),
        );
        expect(result).toStrictEqual(
          new CategoryRepository.SearchResult({
            total: 20,
            filter: null,
            ...item.expected,
            sort: null,
            order: null,
          }),
        );
      }
    });

    it('should return paginated categories ordered by a specific attribute when provided', async () => {
      const categories = CategoryTestBuilder.manyCategories(20).build();
      await repository.insertMany(categories);
      const sortCategories = (prop: string, order: 'asc' | 'desc' = 'asc') =>
        [...categories].sort((a, b) => {
          if (a[prop] < b[prop]) return order === 'asc' ? -1 : 1;
          if (a[prop] > b[prop]) return order === 'asc' ? 1 : -1;
          return 0;
        });
      const arrange: any[] = [
        {
          given: { sort: 'name' },
          expected: {
            items: sortCategories('name').slice(0, 15),
            currentPage: 1,
            limit: 15,
            sort: 'name',
            order: 'asc',
          },
        },
        {
          given: { sort: 'name', order: 'desc' },
          expected: {
            items: sortCategories('name', 'desc').slice(0, 15),
            currentPage: 1,
            limit: 15,
            sort: 'name',
            order: 'desc',
          },
        },
        {
          given: { sort: 'isActive', page: 2 },
          expected: {
            items: sortCategories('isActive').slice(15),
            currentPage: 2,
            limit: 15,
            sort: 'isActive',
            order: 'asc',
          },
        },
        {
          given: { sort: 'isActive', order: 'desc', page: 2, limit: 8 },
          expected: {
            items: sortCategories('isActive', 'desc').slice(8, 16),
            currentPage: 2,
            limit: 8,
            sort: 'isActive',
            order: 'desc',
          },
        },
      ];
      for (const item of arrange) {
        const result = await repository.search(
          new CategoryRepository.SearchParams(item.given),
        );
        expect(result).toStrictEqual(
          new CategoryRepository.SearchResult({
            total: 20,
            filter: null,
            ...item.expected,
          }),
        );
      }
    });

    it('should return paginated categories, sorted by `createdAt` by default and filtered by `name` when provided', async () => {
      const categories = CategoryTestBuilder.manyCategories(12)
        .withName((i) => `Category ${i + 1}`)
        .withDescription(null)
        .withIsActive((i) => i % 2 === 0)
        .withCreatedAt((i) => new Date(new Date().getTime() + i * 100))
        .build();
      await repository.insertMany(categories);
      const arrange: any[] = [
        {
          given: { filter: 'Category 1' },
          expected: {
            items: [
              categories[11],
              categories[10],
              categories[9],
              categories[0],
            ],
            currentPage: 1,
            limit: 15,
            filter: 'Category 1',
            total: 4,
          },
        },
        {
          given: { filter: 'Category 2' },
          expected: {
            items: [categories[1]],
            currentPage: 1,
            limit: 15,
            filter: 'Category 2',
            total: 1,
          },
        },
      ];
      for (const item of arrange) {
        const result = await repository.search(
          new CategoryRepository.SearchParams(item.given),
        );
        expect(result).toStrictEqual(
          new CategoryRepository.SearchResult({
            sort: null,
            order: null,
            ...item.expected,
          }),
        );
      }
    });

    it('should return paginated categories, sorted by a specific attribute and filtered by `name` when provided', async () => {
      const categories = CategoryTestBuilder.manyCategories(12)
        .withName((i) => `Category ${i + 1}`)
        .withDescription(null)
        .withIsActive((i) => i % 2 === 0)
        .withCreatedAt((i) => new Date(new Date().getTime() + i * 100))
        .build();
      await repository.insertMany(categories);

      const arrange: any[] = [
        {
          given: { sort: 'name', filter: 'Category 1' },
          expected: {
            items: [
              categories[0],
              categories[9],
              categories[10],
              categories[11],
            ],
            currentPage: 1,
            limit: 15,
            sort: 'name',
            order: 'asc',
            filter: 'Category 1',
            total: 4,
          },
        },
        {
          given: { sort: 'name', order: 'desc', filter: 'Category 1' },
          expected: {
            items: [
              categories[11],
              categories[10],
              categories[9],
              categories[0],
            ],
            currentPage: 1,
            limit: 15,
            sort: 'name',
            order: 'desc',
            filter: 'Category 1',
            total: 4,
          },
        },
        {
          given: { sort: 'isActive', filter: 'Category 1' },
          expected: {
            items: [
              categories[9],
              categories[11],
              categories[0],
              categories[10],
            ],
            currentPage: 1,
            limit: 15,
            sort: 'isActive',
            order: 'asc',
            filter: 'Category 1',
            total: 4,
          },
        },
        {
          given: { sort: 'isActive', order: 'desc', filter: 'Category 1' },
          expected: {
            items: [
              categories[0],
              categories[10],
              categories[9],
              categories[11],
            ],
            currentPage: 1,
            limit: 15,
            sort: 'isActive',
            order: 'desc',
            filter: 'Category 1',
            total: 4,
          },
        },
        {
          given: {
            sort: 'isActive',
            order: 'desc',
            filter: 'Category 1',
            page: 2,
            limit: 2,
          },
          expected: {
            items: [categories[9], categories[11]],
            currentPage: 2,
            limit: 2,
            sort: 'isActive',
            order: 'desc',
            filter: 'Category 1',
            total: 4,
          },
        },
      ];
      for (const item of arrange) {
        const result = await repository.search(
          new CategoryRepository.SearchParams(item.given),
        );
        expect(result).toStrictEqual(
          new CategoryRepository.SearchResult(item.expected),
        );
      }
    });
  });
});
