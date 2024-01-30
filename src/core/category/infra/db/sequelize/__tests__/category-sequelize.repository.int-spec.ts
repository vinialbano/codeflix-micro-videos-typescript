import { Category, CategoryId } from '../../../../domain/category.aggregate';
import { CategorySequelizeRepository } from '../category-sequelize.repository';
import { CategoryModel } from '../category.model';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { CategoryModelMapper } from '../category-model.mapper';
import {
  CategorySearchParams,
  CategorySearchResult,
} from '../../../../domain/category.repository';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';

describe('CategorySequelizeRepository Integration Tests', () => {
  setupSequelize({
    models: [CategoryModel],
  });

  let repository: CategorySequelizeRepository;
  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  describe('insert()', () => {
    it('should insert a category', async () => {
      const category = Category.fake().aCategory().build();

      await repository.insert(category);
      const model = await CategoryModel.findByPk(category.categoryId.id);
      expect(model?.toJSON()).toMatchObject(category.toJSON());
    });
  });

  describe('insertMany()', () => {
    it('should insert many categories', async () => {
      const categories = Category.fake().someCategories(3).build();

      await repository.insertMany(categories);
      const models = await CategoryModel.findAll();
      expect(models.length).toBe(3);
      for (let i = 0; i < models.length; i++) {
        expect(models[i]!.toJSON()).toMatchObject(categories[i]!.toJSON());
      }
    });
  });

  describe('update()', () => {
    it('should throw an error if the category does not exist', async () => {
      const category = Category.fake().aCategory().build();
      await expect(repository.update(category)).rejects.toThrow(
        new NotFoundError(category.categoryId.id, Category),
      );
    });

    it('should update a category', async () => {
      const category = Category.fake().aCategory().build();
      await repository.insert(category);

      category.changeName('New Name');
      category.changeDescription('New Description');
      category.deactivate();

      await repository.update(category);
      const model = await CategoryModel.findByPk(category.categoryId.id);
      expect(model?.toJSON()).toMatchObject(category.toJSON());
    });
  });

  describe('delete()', () => {
    it('should throw an error if the category does not exist', async () => {
      const id = new CategoryId();
      await expect(repository.delete(id)).rejects.toThrow(
        new NotFoundError(id, Category),
      );
    });

    it('should delete a category', async () => {
      const category = Category.fake().aCategory().build();
      await repository.insert(category);

      await repository.delete(category.categoryId);
      const model = await CategoryModel.findByPk(category.categoryId.id);
      expect(model).toBeNull();
    });
  });

  describe('findById()', () => {
    it('should find a category by id', async () => {
      const category = Category.fake().aCategory().build();
      await repository.insert(category);

      const found = await repository.findById(category.categoryId);
      expect(found?.toJSON()).toMatchObject(category.toJSON());
    });
  });

  describe('findAll()', () => {
    it('should find all categories', async () => {
      const categories = Category.fake().someCategories(3).build();
      await CategoryModel.bulkCreate(categories.map((c) => c.toJSON()));

      const found = await repository.findAll();
      expect(found.length).toBe(3);
      for (let i = 0; i < found.length; i++) {
        expect(found[i]!.toJSON()).toMatchObject(categories[i]!.toJSON());
      }
    });
  });

  describe('search()', () => {
    it('should only paginate when other params are not provided', async () => {
      const createdAt = new Date();
      const categories = Category.fake()
        .someCategories(16)
        .withCreatedAt(createdAt)
        .build();
      await CategoryModel.bulkCreate(categories.map((c) => c.toJSON()));
      const toEntitySpy = jest.spyOn(CategoryModelMapper, 'toEntity');

      const searchOutput = await repository.search(new CategorySearchParams());
      expect(searchOutput).toBeInstanceOf(CategorySearchResult);
      expect(toEntitySpy).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        currentPage: 1,
        lastPage: 2,
        limit: 15,
      });
      expect(searchOutput.items.length).toBe(15);
      searchOutput.items.forEach((item, index) => {
        expect(item).toBeInstanceOf(Category);
        expect(item.toJSON()).toMatchObject(categories[index]!.toJSON());
      });
    });

    it('should order by createdAt desc when no sort is provided', async () => {
      const createdAt = new Date();
      const categories = Category.fake()
        .someCategories(16)
        .withCreatedAt((i) => new Date(createdAt.getTime() + i * 1000))
        .build();
      await CategoryModel.bulkCreate(categories.map((c) => c.toJSON()));

      const searchOutput = await repository.search(new CategorySearchParams());
      const items = searchOutput.items;
      [...items].reverse().forEach((item, index) => {
        expect(item.toJSON()).toMatchObject(categories[index + 1]!.toJSON());
      });
    });

    it('should apply paginate and filter', async () => {
      const categories = [
        ...Category.fake()
          .someCategories(2)
          .withName((i) => `Test ${i}`)
          .withCreatedAt(
            (i) => new Date(new Date().getTime() + 4000 - i * 1000),
          )
          .build(),
        ...Category.fake()
          .someCategories(3)
          .withName((i) => `Category ${i}`)
          .withCreatedAt(
            (i) => new Date(new Date().getTime() + 5000 - i * 1000),
          )
          .build(),
      ];
      await CategoryModel.bulkCreate(categories.map((c) => c.toJSON()));

      const searchOutput = await repository.search(
        new CategorySearchParams({
          page: 1,
          limit: 2,
          filter: 'Category',
        }),
      );
      expect(searchOutput).toBeInstanceOf(CategorySearchResult);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 3,
        currentPage: 1,
        lastPage: 2,
        limit: 2,
      });
      expect(searchOutput.items.length).toBe(2);
      expect(searchOutput.items[0]!.toJSON()).toMatchObject(
        categories[2]!.toJSON(),
      );
      expect(searchOutput.items[1]!.toJSON()).toMatchObject(
        categories[3]!.toJSON(),
      );
    });

    it('should apply paginate and sort', async () => {
      expect(repository.sortableFields).toStrictEqual(['name', 'createdAt']);
      const createdAt = new Date();
      const categories = [
        Category.fake()
          .aCategory()
          .withName('B')
          .withCreatedAt(new Date(createdAt.getTime()))
          .build(),
        Category.fake()
          .aCategory()
          .withName('A')
          .withCreatedAt(new Date(createdAt.getTime() + 1000))
          .build(),
        Category.fake()
          .aCategory()
          .withName('C')
          .withCreatedAt(new Date(createdAt.getTime() + 2000))
          .build(),
        Category.fake()
          .aCategory()
          .withName('E')
          .withCreatedAt(new Date(createdAt.getTime() + 3000))
          .build(),
        Category.fake()
          .aCategory()
          .withName('D')
          .withCreatedAt(new Date(createdAt.getTime() + 4000))
          .build(),
      ];
      await CategoryModel.bulkCreate(categories.map((c) => c.toJSON()));

      const arrange = [
        {
          params: new CategorySearchParams({
            page: 1,
            limit: 2,
            sort: 'name',
          }),
          expected: [categories[1]!.toJSON(), categories[0]!.toJSON()],
        },
        {
          params: new CategorySearchParams({
            page: 1,
            limit: 2,
            sort: 'name',
            sortDirection: 'desc',
          }),
          expected: [categories[3]!.toJSON(), categories[4]!.toJSON()],
        },
        {
          params: new CategorySearchParams({
            page: 1,
            limit: 2,
            sort: 'createdAt',
          }),
          expected: [categories[0]!.toJSON(), categories[1]!.toJSON()],
        },
        {
          params: new CategorySearchParams({
            page: 1,
            limit: 2,
            sort: 'createdAt',
            sortDirection: 'desc',
          }),
          expected: [categories[4]!.toJSON(), categories[3]!.toJSON()],
        },
        {
          params: new CategorySearchParams({
            page: 1,
            limit: 2,
            sort: 'invalidField',
          }),
          // Sort by createdAt desc by default
          expected: [categories[4]!.toJSON(), categories[3]!.toJSON()],
        },
      ];

      for (const { params, expected } of arrange) {
        const searchOutput = await repository.search(params);
        expect(searchOutput).toBeInstanceOf(CategorySearchResult);
        expect(searchOutput.toJSON()).toMatchObject({
          total: 5,
          currentPage: 1,
          lastPage: 3,
          limit: 2,
        });
        expect(searchOutput.items.length).toBe(2);
        expect(searchOutput.items[0]!.toJSON()).toMatchObject(expected[0]!);
        expect(searchOutput.items[1]!.toJSON()).toMatchObject(expected[1]!);
      }
    });

    it('should apply paginate, filter and sort', async () => {
      const categories = [
        ...Category.fake()
          .someCategories(2)
          .withName((i) => `Test ${i}`)
          .withCreatedAt(
            (i) => new Date(new Date().getTime() + 4000 - i * 1000),
          )
          .build(),
        ...Category.fake()
          .someCategories(3)
          .withName((i) => `Category ${i}`)
          .withCreatedAt(
            (i) => new Date(new Date().getTime() + 5000 - i * 1000),
          )
          .build(),
      ];
      await CategoryModel.bulkCreate(categories.map((c) => c.toJSON()));

      const searchOutput = await repository.search(
        new CategorySearchParams({
          page: 1,
          limit: 2,
          filter: 'Category',
          sort: 'name',
          sortDirection: 'desc',
        }),
      );
      expect(searchOutput).toBeInstanceOf(CategorySearchResult);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 3,
        currentPage: 1,
        lastPage: 2,
        limit: 2,
      });
      expect(searchOutput.items.length).toBe(2);
      expect(searchOutput.items[0]!.toJSON()).toMatchObject(
        categories[4]!.toJSON(),
      );
      expect(searchOutput.items[1]!.toJSON()).toMatchObject(
        categories[3]!.toJSON(),
      );
    });
  });
});
