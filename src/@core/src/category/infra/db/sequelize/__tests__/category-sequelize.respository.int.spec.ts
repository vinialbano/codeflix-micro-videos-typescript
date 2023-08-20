import { Category, CategoryRepository } from '#category/domain';
import {
  EntityLoadError,
  NotFoundError,
  UniqueEntityID,
} from '#seedwork/domain';
import { setupSequelize } from '#seedwork/tests';
import { Chance } from 'chance';
import { CategoryModel } from '../category-model';
import { CategoryModelFactory } from '../category-model.factory';
import { CategoryModelMapper } from '../category-model.mapper';
import { CategorySequelizeRepository } from '../category-sequelize.repository';

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
      const arrange: any[] = [
        {
          name: 'Category 1',
        },
        {
          name: 'Category 2',
          description: 'Category 2 description',
          isActive: false,
        },
        {
          name: 'Category 3',
          description: null,
          isActive: true,
        },
      ];
      for (const item of arrange) {
        const category = new Category(item);
        await repository.insert(category);
        const model = await CategoryModel.findByPk(category.id);
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
      const category = new Category({
        name: 'Category 1',
      });
      await repository.insert(category);
      const result = await repository.findById(category.id);
      expect(result).toStrictEqual(category);
    });
  });

  describe('findAll()', () => {
    it('should throw an error if a category is not valid', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      await CategoryModel.create({
        id,
        name: '',
        isActive: true,
        createdAt: new Date(),
      });
      await expect(repository.findAll()).rejects.toThrowError(EntityLoadError);
    });

    it('should return an empty array if no categories are found', async () => {
      const result = await repository.findAll();
      expect(result).toStrictEqual([]);
    });

    it('should return all categories', async () => {
      const arrange: any[] = [
        {
          name: 'Category 1',
        },
        {
          name: 'Category 2',
          description: 'Category 2 description',
          isActive: false,
        },
        {
          name: 'Category 3',
          description: null,
          isActive: true,
        },
      ];
      const expected: Category[] = [];
      for (const item of arrange) {
        const category = new Category(item);
        await repository.insert(category);
        expected.push(category);
      }
      const result = await repository.findAll();
      expect(result).toStrictEqual(expected);
    });
  });

  describe('update()', () => {
    it('should throw an error if category not found', async () => {
      const category = new Category({ name: 'Category 1' });
      await expect(repository.update(category)).rejects.toThrowError(
        new NotFoundError(`Entity not found using ID ${category.id}`),
      );
    });

    it('should throw an error if category is not valid', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const category = new Category(
        { name: 'Category 1' },
        new UniqueEntityID(id),
      );
      await CategoryModel.create({
        id,
        name: '',
        isActive: true,
        createdAt: new Date(),
      });
      await expect(repository.update(category)).rejects.toThrowError(
        EntityLoadError,
      );
    });

    it('should update a category', async () => {
      const category = new Category({
        name: 'Category 1',
      });
      await repository.insert(category);
      category.update('Category 1 updated', 'Category 1 description');
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
      const id = '123e4567-e89b-12d3-a456-426614174000';
      await CategoryModel.create({
        id,
        name: '',
        isActive: true,
        createdAt: new Date(),
      });
      await expect(repository.delete(id)).rejects.toThrowError(EntityLoadError);
    });

    it('should delete a category', async () => {
      const category = new Category({
        name: 'Category 1',
      });
      await repository.insert(category);
      await repository.delete(category.id);
      await expect(repository.findById(category.id)).rejects.toThrowError(
        new NotFoundError(`Entity not found using ID ${category.id}`),
      );
    });
  });

  describe('search()', () => {
    it('should throw an error if a category is not valid', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      await CategoryModel.create({
        id,
        name: '',
        isActive: true,
        createdAt: new Date(),
      });
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
      const entities = (await CategoryModelFactory().count(20).bulkCreate())
        .sort((a, b) => {
          if (a.createdAt < b.createdAt) return 1;
          if (a.createdAt > b.createdAt) return -1;
          return 0;
        })
        .map(CategoryModelMapper.toEntity);
      const arrange = [
        {
          given: undefined,
          expected: {
            items: entities.slice(0, 15),
            currentPage: 1,
            limit: 15,
          },
        },
        {
          given: { page: 2 },
          expected: {
            items: entities.slice(15),
            currentPage: 2,
            limit: 15,
          },
        },
        {
          given: { page: 2, limit: 8 },
          expected: {
            items: entities.slice(8, 16),
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
      const entities = (await CategoryModelFactory().count(20).bulkCreate())
        .sort((a, b) => {
          if (a.createdAt < b.createdAt) return 1;
          if (a.createdAt > b.createdAt) return -1;
          return 0;
        })
        .map(CategoryModelMapper.toEntity);
      const arrange: any[] = [
        {
          given: { sort: 'any', order: 'asc' },
          expected: {
            items: entities.slice(0, 15),
            currentPage: 1,
            limit: 15,
          },
        },
        {
          given: { sort: 'any', order: 'desc' },
          expected: {
            items: entities.slice(0, 15),
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
      const entities = (
        await CategoryModelFactory().count(20).bulkCreate()
      ).map(CategoryModelMapper.toEntity);
      const sortEntities = (prop: string, order: 'asc' | 'desc' = 'asc') =>
        [...entities].sort((a, b) => {
          if (a[prop] < b[prop]) return order === 'asc' ? -1 : 1;
          if (a[prop] > b[prop]) return order === 'asc' ? 1 : -1;
          return 0;
        });
      const arrange: any[] = [
        {
          given: { sort: 'name' },
          expected: {
            items: sortEntities('name').slice(0, 15),
            currentPage: 1,
            limit: 15,
            sort: 'name',
            order: 'asc',
          },
        },
        {
          given: { sort: 'name', order: 'desc' },
          expected: {
            items: sortEntities('name', 'desc').slice(0, 15),
            currentPage: 1,
            limit: 15,
            sort: 'name',
            order: 'desc',
          },
        },
        {
          given: { sort: 'isActive', page: 2 },
          expected: {
            items: sortEntities('isActive').slice(15),
            currentPage: 2,
            limit: 15,
            sort: 'isActive',
            order: 'asc',
          },
        },
        {
          given: { sort: 'isActive', order: 'desc', page: 2, limit: 8 },
          expected: {
            items: sortEntities('isActive', 'desc').slice(8, 16),
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
      const entities = (
        await CategoryModelFactory()
          .count(12)
          .bulkCreate((n) => ({
            id: Chance().guid({ version: 4 }),
            name: `Category ${n + 1}`,
            description: null,
            isActive: true,
            createdAt: new Date(`2021-01-${n + 1 < 10 ? `0${n + 1}` : n + 1}`),
          }))
      ).map(CategoryModelMapper.toEntity);
      const arrange: any[] = [
        {
          given: { filter: 'Category 1' },
          expected: {
            items: [entities[11], entities[10], entities[9], entities[0]],
            currentPage: 1,
            limit: 15,
            filter: 'Category 1',
            total: 4,
          },
        },
        {
          given: { filter: 'Category 2' },
          expected: {
            items: [entities[1]],
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
      const entities = (
        await CategoryModelFactory()
          .count(12)
          .bulkCreate((n) => ({
            id: Chance().guid({ version: 4 }),
            name: `Category ${n + 1}`,
            description: null,
            isActive: n % 2 === 0 ? true : false,
            createdAt: new Date(`2021-01-${n + 1 < 10 ? `0${n + 1}` : n + 1}`),
          }))
      ).map(CategoryModelMapper.toEntity);

      const arrange: any[] = [
        {
          given: { sort: 'name', filter: 'Category 1' },
          expected: {
            items: [entities[0], entities[9], entities[10], entities[11]],
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
            items: [entities[11], entities[10], entities[9], entities[0]],
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
            items: [entities[9], entities[11], entities[0], entities[10]],
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
            items: [entities[0], entities[10], entities[9], entities[11]],
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
            items: [entities[9], entities[11]],
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
