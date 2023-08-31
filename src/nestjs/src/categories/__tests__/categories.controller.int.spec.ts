import { NotFoundError } from '@codeflix/micro-videos/@seedwork/domain';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@codeflix/micro-videos/category/application';
import {
  Category,
  CategoryRepository,
  CategoryTestBuilder,
} from '@codeflix/micro-videos/category/domain';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '../../config/config.module';
import { DatabaseModule } from '../../database/database.module';
import { CategoriesController } from '../categories.controller';
import { CategoriesModule } from '../categories.module';
import { CATEGORIES_PROVIDERS } from '../categories.providers';
import { CategoryCollectionPresenter } from '../presenter/category-collection.presenter';

describe('CategoriesController Integration  Tests', () => {
  let controller: CategoriesController;
  let repository: CategoryRepository.Repository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();
    controller = module.get(CategoriesController);
    repository = module.get(
      CATEGORIES_PROVIDERS.REPOSITORIES.CATEGORY_SEQUELIZE.provide,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(
      CreateCategoryUseCase.UseCase,
    );
    expect(controller['updateUseCase']).toBeInstanceOf(
      UpdateCategoryUseCase.UseCase,
    );
    expect(controller['deleteUseCase']).toBeInstanceOf(
      DeleteCategoryUseCase.UseCase,
    );
    expect(controller['getUseCase']).toBeInstanceOf(GetCategoryUseCase.UseCase);
    expect(controller['listUseCase']).toBeInstanceOf(
      ListCategoriesUseCase.UseCase,
    );
  });

  describe('should create a category', () => {
    const arrange = [
      {
        request: { name: 'Category' },
        expectedPresenter: {
          name: 'Category',
          description: null,
          isActive: true,
        },
      },
      {
        request: { name: 'Category', description: 'Category description' },
        expectedPresenter: {
          name: 'Category',
          description: 'Category description',
          isActive: true,
        },
      },
      {
        request: { name: 'Category', isActive: false },
        expectedPresenter: {
          name: 'Category',
          description: null,
          isActive: false,
        },
      },
      {
        request: {
          name: 'Category',
          description: 'Category description',
          isActive: false,
        },
        expectedPresenter: {
          name: 'Category',
          description: 'Category description',
          isActive: false,
        },
      },
      {
        request: { name: 'Category', description: null, isActive: true },
        expectedPresenter: {
          name: 'Category',
          description: null,
          isActive: true,
        },
      },
    ];
    it.each(arrange)(
      'with request $request',
      async ({ request, expectedPresenter }) => {
        const presenter = await controller.create(request);
        const entity = await repository.findById(presenter.id);
        expect(entity).toMatchObject({
          id: presenter.id,
          name: presenter.name,
          description: presenter.description,
          isActive: presenter.isActive,
          createdAt: presenter.createdAt,
        });
        expect(presenter.id).toEqual(entity.id);
        expect(presenter.name).toEqual(expectedPresenter.name);
        expect(presenter.description).toEqual(expectedPresenter.description);
        expect(presenter.isActive).toEqual(expectedPresenter.isActive);
        expect(presenter.createdAt).toEqual(entity.createdAt);
      },
    );
  });

  describe('should update a category', () => {
    let category: Category;
    beforeEach(async () => {
      category = CategoryTestBuilder.aCategory().build();
      await repository.insert(category);
    });

    const arrange = [
      {
        request: { name: 'Category' },
        expectedPresenter: { name: 'Category', description: null },
      },
      {
        request: { name: 'Category', description: null },
        expectedPresenter: { name: 'Category', description: null },
      },
      {
        request: { name: 'Category', description: 'Category description' },
        expectedPresenter: {
          name: 'Category',
          description: 'Category description',
        },
      },
      {
        request: { name: 'Category', isActive: false },
        expectedPresenter: {
          name: 'Category',
          description: null,
          isActive: false,
        },
      },
      {
        request: { name: 'Category', isActive: true },
        expectedPresenter: {
          name: 'Category',
          description: null,
          isActive: true,
        },
      },
      {
        request: {
          name: 'Category',
          description: 'Category description',
          isActive: false,
        },
        expectedPresenter: {
          name: 'Category',
          description: 'Category description',
          isActive: false,
        },
      },
      {
        request: {
          name: 'Category',
          description: 'Category description',
          isActive: true,
        },
        expectedPresenter: {
          name: 'Category',
          description: 'Category description',
          isActive: true,
        },
      },
    ];
    it.each(arrange)(
      'with request $request',
      async ({ request, expectedPresenter }) => {
        const presenter = await controller.update(category.id, request);
        const entity = await repository.findById(presenter.id);
        expect(entity).toMatchObject({
          id: presenter.id,
          name: presenter.name,
          description: presenter.description,
          isActive: presenter.isActive,
          createdAt: presenter.createdAt,
        });
        expect(presenter.id).toEqual(entity.id);
        expect(presenter.name).toEqual(expectedPresenter.name);
        expect(presenter.description).toEqual(expectedPresenter.description);
        expect(presenter.isActive).toEqual(
          expectedPresenter.isActive ?? category.isActive,
        );
        expect(presenter.createdAt).toEqual(entity.createdAt);
      },
    );
  });

  it('should delete a category', async () => {
    const category = CategoryTestBuilder.aCategory().build();
    await repository.insert(category);
    const response = await controller.remove(category.id);
    expect(response).toBeUndefined();
    await expect(repository.findById(category.id)).rejects.toThrowError(
      new NotFoundError(`Entity not found using ID ${category.id}`),
    );
  });

  it('should get a category', async () => {
    const category = CategoryTestBuilder.aCategory().build();
    await repository.insert(category);
    const presenter = await controller.findOne(category.id);
    expect(presenter.id).toEqual(category.id);
    expect(presenter.name).toEqual(category.name);
    expect(presenter.description).toEqual(category.description);
    expect(presenter.isActive).toEqual(category.isActive);
    expect(presenter.createdAt).toEqual(category.createdAt);
  });

  describe('search()', () => {
    describe('should list all categories sorted by createdAt by default, when filter is empty', () => {
      const arrange = [
        {
          input: {},
          output: {
            items: [3, 2, 1, 0],
            total: 4,
            currentPage: 1,
            lastPage: 1,
            limit: 15,
          },
        },
        {
          input: { limit: 2 },
          output: {
            items: [3, 2],
            total: 4,
            currentPage: 1,
            lastPage: 2,
            limit: 2,
          },
        },
        {
          input: { limit: 2, page: 2 },
          output: {
            items: [1, 0],
            total: 4,
            currentPage: 2,
            lastPage: 2,
            limit: 2,
          },
        },
      ];
      it.each(arrange)('works with $input', async ({ input, output }) => {
        const categories = CategoryTestBuilder.manyCategories(4)
          .withCreatedAt((i) => new Date(new Date().getTime() + i))
          .build();
        await repository.insertMany(categories);

        const presenter = await controller.search(input);
        expect(presenter).toStrictEqual(
          new CategoryCollectionPresenter({
            ...output,
            items: output.items.map((i) => categories[i]),
          }),
        );
      });
    });

    describe('should list categories that match the filter, sorted by createdAt by default', () => {
      const arrange = [
        {
          input: { filter: 'Movie' },
          output: {
            items: [2, 0],
            total: 2,
            currentPage: 1,
            lastPage: 1,
            limit: 15,
          },
        },
        {
          input: { filter: 'movie' },
          output: {
            items: [2, 0],
            total: 2,
            currentPage: 1,
            lastPage: 1,
            limit: 15,
          },
        },
        {
          input: { filter: 'Series', limit: 1 },
          output: {
            items: [3],
            total: 2,
            currentPage: 1,
            lastPage: 2,
            limit: 1,
          },
        },
        {
          input: { filter: 'Series', limit: 1, page: 2 },
          output: {
            items: [1],
            total: 2,
            currentPage: 2,
            lastPage: 2,
            limit: 1,
          },
        },
      ];
      it.each(arrange)('works with $input', async ({ input, output }) => {
        const categories = CategoryTestBuilder.manyCategories(4)
          .withName((i) => (i % 2 === 0 ? `Movie ${i}` : `Series ${i}`))
          .withCreatedAt((i) => new Date(new Date().getTime() + i))
          .build();
        await repository.insertMany(categories);

        const presenter = await controller.search(input);
        expect(presenter).toStrictEqual(
          new CategoryCollectionPresenter({
            ...output,
            items: output.items.map((i) => categories[i]),
          }),
        );
      });
    });

    describe('should list categories that match the filter, sorted by the given field', () => {
      const arrange = [
        {
          input: { filter: 'Movie', sort: 'name' as const },
          output: {
            items: [0, 2],
            total: 2,
            currentPage: 1,
            lastPage: 1,
            limit: 15,
          },
        },
        {
          input: {
            filter: 'movie',
            sort: 'name' as const,
            order: 'asc' as const,
          },
          output: {
            items: [0, 2],
            total: 2,
            currentPage: 1,
            lastPage: 1,
            limit: 15,
          },
        },
        {
          input: {
            filter: 'movie',
            sort: 'name' as const,
            order: 'desc' as const,
          },
          output: {
            items: [2, 0],
            total: 2,
            currentPage: 1,
            lastPage: 1,
            limit: 15,
          },
        },
        {
          input: { filter: 'Series', sort: 'name' as const, limit: 1 },
          output: {
            items: [1],
            total: 2,
            currentPage: 1,
            lastPage: 2,
            limit: 1,
          },
        },
        {
          input: {
            filter: 'Series',
            sort: 'name' as const,
            order: 'asc' as const,
            limit: 1,
          },
          output: {
            items: [1],
            total: 2,
            currentPage: 1,
            lastPage: 2,
            limit: 1,
          },
        },
        {
          input: {
            filter: 'Series',
            sort: 'name' as const,
            order: 'desc' as const,
            limit: 1,
          },
          output: {
            items: [3],
            total: 2,
            currentPage: 1,
            lastPage: 2,
            limit: 1,
          },
        },
        {
          input: { filter: 'Series', sort: 'name' as const, limit: 1, page: 2 },
          output: {
            items: [3],
            total: 2,
            currentPage: 2,
            lastPage: 2,
            limit: 1,
          },
        },
        {
          input: {
            filter: 'Series',
            sort: 'name' as const,
            order: 'asc' as const,
            limit: 1,
            page: 2,
          },
          output: {
            items: [3],
            total: 2,
            currentPage: 2,
            lastPage: 2,
            limit: 1,
          },
        },
        {
          input: {
            filter: 'Series',
            sort: 'name' as const,
            order: 'desc' as const,
            limit: 1,
            page: 2,
          },
          output: {
            items: [1],
            total: 2,
            currentPage: 2,
            lastPage: 2,
            limit: 1,
          },
        },
      ];
      it.each(arrange)('works with $input', async ({ input, output }) => {
        const categories = CategoryTestBuilder.manyCategories(4)
          .withName((i) => (i % 2 === 0 ? `Movie ${i}` : `Series ${i}`))
          .withCreatedAt((i) => new Date(new Date().getTime() + i))
          .build();
        await repository.insertMany(categories);

        const presenter = await controller.search(input);
        expect(presenter).toStrictEqual(
          new CategoryCollectionPresenter({
            ...output,
            items: output.items.map((i) => categories[i]),
          }),
        );
      });
    });
  });
});
