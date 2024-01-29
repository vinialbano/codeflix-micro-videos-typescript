import request from 'supertest';
import { CreateCategoryFixture } from '../../src/nest-modules/categories-module/__tests__/category-fixture';
import { CategoryRepository } from '@core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from '../../src/nest-modules/categories-module/categories.providers';
import { startApp } from '../helpers';
import { Category } from '@core/category/domain/category.entity';
import { UUID } from '@core/shared/domain/value-objects/uuid.vo';
import { CategoriesController } from '../../src/nest-modules/categories-module/categories.controller';
import { CategoryOutputMapper } from '@core/category/application/use-cases/shared/category-output';
import { instanceToPlain } from 'class-transformer';

describe('CategoriesController (e2e)', () => {
  const appHelper = startApp();
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    categoryRepository = appHelper.app.get<CategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });

  describe('POST /categories', () => {
    describe('should return a response error with 422 status code when request body is invalid', () => {
      const invalidRequests = CreateCategoryFixture.arrangeInvalidRequest();
      const arrange = Object.keys(invalidRequests).map((key) => ({
        label: key,
        value: invalidRequests[key as keyof typeof invalidRequests],
      }));

      it.each(arrange)(
        'when $label',
        async ({ value: { sentData, expected } }) => {
          const res = await request(appHelper.app.getHttpServer())
            .post('/categories')
            .send(sentData)
            .expect(422)
            .expect('Content-Type', /json/);

          expect(res.body).toStrictEqual(expected);
        },
      );
    });

    describe('should return a response error with 422 status code when throw EntityValidationError', () => {
      const invalidRequests =
        CreateCategoryFixture.arrangeForEntityValidationError();
      const arrange = Object.keys(invalidRequests).map((key) => ({
        label: key,
        value: invalidRequests[key as keyof typeof invalidRequests],
      }));

      it.each(arrange)(
        'when $label',
        async ({ value: { sentData, expected } }) => {
          const res = await request(appHelper.app.getHttpServer())
            .post('/categories')
            .send(sentData)
            .expect(422)
            .expect('Content-Type', /json/);

          expect(res.body).toStrictEqual(expected);
        },
      );
    });

    describe('should create a category', () => {
      const arrange = CreateCategoryFixture.arrangeForCreate();
      it.each(arrange)(
        'when body is $sentData',
        async ({ sentData, expected }) => {
          const res = await request(appHelper.app.getHttpServer())
            .post('/categories')
            .send(sentData)
            .expect(201)
            .expect('Content-Type', /json/);

          const keysInResponse = CreateCategoryFixture.keysInResponse;
          expect(Object.keys(res.body)).toEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);

          const id = res.body.data.id;
          const categoryCreated = (await categoryRepository.findById(
            new UUID(id),
          )) as Category;
          expect(categoryCreated).toBeDefined();

          const presenter = CategoriesController.serialize(
            CategoryOutputMapper.toDTO(categoryCreated),
          );
          const serialized = instanceToPlain(presenter);
          expect(res.body.data).toStrictEqual({
            id: serialized.id,
            createdAt: serialized.createdAt,
            ...expected,
          });
        },
      );
    });
  });
});
