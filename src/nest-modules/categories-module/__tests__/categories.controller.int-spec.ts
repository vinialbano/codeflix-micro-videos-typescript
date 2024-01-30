import { CategoryRepository } from '@core/category/domain/category.repository';
import { CategoriesController } from '../categories.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '../../config-module/config.module';
import { DatabaseModule } from '../../database-module/database.module';
import { CategoriesModule } from '../categories.module';
import { CreateCategoryUseCase } from '@core/category/application/use-cases/create-category/create-category.use-case';
import { UpdateCategoryUseCase } from '@core/category/application/use-cases/update-category/update-category.use-case';
import { DeleteCategoryUseCase } from '@core/category/application/use-cases/delete-category/delete-category.use-case';
import { GetCategoryUseCase } from '@core/category/application/use-cases/get-category/get-category.use-case';
import { ListCategoriesUseCase } from '@core/category/application/use-cases/list-categories/list-categories.use-case';
import {
  CreateCategoryFixture,
  ListCategoriesFixture,
  UpdateCategoryFixture,
} from './category-fixture';
import { CategoryOutputMapper } from '@core/category/application/use-cases/shared/category-output';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from '../categories.presenter';
import { Category, CategoryId } from '@core/category/domain/category.aggregate';

describe('CategoriesController Integration Tests', () => {
  let controller: CategoriesController;
  let repository: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    repository = module.get<CategoryRepository>('CategoryRepository');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(CreateCategoryUseCase);
    expect(controller['updateUseCase']).toBeInstanceOf(UpdateCategoryUseCase);
    expect(controller['deleteUseCase']).toBeInstanceOf(DeleteCategoryUseCase);
    expect(controller['getUseCase']).toBeInstanceOf(GetCategoryUseCase);
    expect(controller['listUseCase']).toBeInstanceOf(ListCategoriesUseCase);
  });

  describe('create()', () => {
    describe('should create a category', () => {
      const arrange = CreateCategoryFixture.arrangeForCreate();
      it.each(arrange)(
        'when body is $sentData',
        async ({ sentData, expected }) => {
          const presenter = await controller.create(sentData);
          const entity = (await repository.findById(
            new CategoryId(presenter.id),
          )) as Category;
          const output = CategoryOutputMapper.toDTO(entity);
          expect(presenter).toEqual(new CategoryPresenter(output));
          expect(entity.toJSON()).toStrictEqual({
            categoryId: presenter.id,
            createdAt: presenter.createdAt,
            ...expected,
          });
        },
      );
    });
  });

  describe('update()', () => {
    describe('should update a category', () => {
      const arrange = UpdateCategoryFixture.arrangeForUpdate();
      it.each(arrange)(
        'when body is $sentData',
        async ({ sentData, expected }) => {
          const category = Category.fake().aCategory().build();
          await repository.insert(category);
          const presenter = await controller.update(
            category.categoryId.id,
            sentData,
          );
          const entity = (await repository.findById(
            new CategoryId(presenter.id),
          )) as Category;
          const output = CategoryOutputMapper.toDTO(entity);
          expect(presenter).toEqual(new CategoryPresenter(output));
          expect(entity.toJSON()).toStrictEqual({
            categoryId: presenter.id,
            createdAt: presenter.createdAt,
            name: expected.name ?? category.name,
            description:
              'description' in expected
                ? expected.description
                : category.description,
            isActive:
              'isActive' in expected ? expected.isActive : category.isActive,
          });
        },
      );
    });
  });

  describe('delete()', () => {
    it('should delete a category', async () => {
      const category = Category.fake().aCategory().build();
      await repository.insert(category);
      const response = await controller.remove(category.categoryId.id);
      const entity = await repository.findById(
        new CategoryId(category.categoryId.id),
      );
      expect(response).toBeUndefined();
      expect(entity).toBeNull();
    });
  });

  describe('get()', () => {
    it('should return a category', async () => {
      const category = Category.fake().aCategory().build();
      await repository.insert(category);
      const presenter = await controller.findOne(category.categoryId.id);
      const entity = (await repository.findById(
        new CategoryId(presenter.id),
      )) as Category;
      const output = CategoryOutputMapper.toDTO(entity);
      expect(presenter).toEqual(new CategoryPresenter(output));
    });
  });

  describe('search()', () => {
    describe('should return a list of categories sorted by createdAt by default', () => {
      const { entitiesMap, arrange } =
        ListCategoriesFixture.arrangeIncrementedWithCreatedAt();
      it.each(arrange)(
        'when query is $sentData',
        async ({ sentData, expected }) => {
          await repository.insertMany(Object.values(entitiesMap));
          const presenter = await controller.search(sentData);
          const { entities, meta } = expected;
          expect(presenter).toEqual(
            new CategoryCollectionPresenter({
              items: entities.map(CategoryOutputMapper.toDTO),
              ...meta,
            }),
          );
        },
      );
    });

    describe('should return a list of categories sorted by given param', () => {
      const { entitiesMap, arrange } = ListCategoriesFixture.arrangeUnsorted();
      it.each(arrange)(
        'when query is $sentData',
        async ({ sentData, expected }) => {
          await repository.insertMany(Object.values(entitiesMap));
          const presenter = await controller.search(sentData);
          const { entities, meta } = expected;
          expect(presenter).toEqual(
            new CategoryCollectionPresenter({
              items: entities.map(CategoryOutputMapper.toDTO),
              ...meta,
            }),
          );
        },
      );
    });
  });
});
