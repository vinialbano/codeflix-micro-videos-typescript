import request from 'supertest';
import {
  CreateCategoryFixture,
  UpdateCategoryFixture,
} from '../../src/nest-modules/categories-module/__tests__/category-fixture';
import { CategoryRepository } from '@core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from '../../src/nest-modules/categories-module/categories.providers';
import { startApp } from '../helpers';
import { Category, CategoryId } from '@core/category/domain/category.aggregate';
import { CategoriesController } from '../../src/nest-modules/categories-module/categories.controller';
import { CategoryOutputMapper } from '@core/category/application/use-cases/shared/category-output';
import { instanceToPlain } from 'class-transformer';

describe('CategoriesController (e2e)', () => {
  const appHelper = startApp();
  let categoryRepository: CategoryRepository;
  const id = new CategoryId();

  beforeEach(async () => {
    categoryRepository = appHelper.app.get<CategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });

  describe('PATCH /categories/:id', () => {
    it('should return a response error with 422 status code when id is invalid', async () => {
      const faker = Category.fake().aCategory();
      const res = await request(appHelper.app.getHttpServer())
        .patch('/categories/invalid_id')
        .send({ name: faker.name })
        .expect(422)
        .expect('Content-Type', /json/);

      expect(res.body).toStrictEqual({
        statusCode: 422,
        message: 'Validation failed (uuid is expected)',
        error: 'Unprocessable Entity',
      });
    });

    it('should return a response error with 404 status code when entity is not found', async () => {
      const faker = Category.fake().aCategory();

      const res = await request(appHelper.app.getHttpServer())
        .patch(`/categories/${id}`)
        .send({ name: faker.name })
        .expect(404)
        .expect('Content-Type', /json/);

      expect(res.body).toStrictEqual({
        statusCode: 404,
        error: 'Not Found',
        message: `Entity Category not found with id(s): ${id}`,
      });
    });

    describe('should return a response error with 422 status code when request body is invalid', () => {
      const invalidRequests = UpdateCategoryFixture.arrangeInvalidRequest();
      const arrange = Object.keys(invalidRequests).map((key) => ({
        label: key,
        value: invalidRequests[key as keyof typeof invalidRequests],
      }));

      beforeEach(async () => {
        const category = Category.fake().aCategory().withCategoryId(id).build();
        await categoryRepository.insert(category);
      });

      it.each(arrange)(
        'when $label',
        async ({ value: { sentData, expected } }) => {
          const res = await request(appHelper.app.getHttpServer())
            .patch(`/categories/${id}`)
            .send(sentData)
            .expect(422)
            .expect('Content-Type', /json/);

          expect(res.body).toStrictEqual(expected);
        },
      );
    });

    describe('should return a response error with 422 status code when throw EntityValidationError', () => {
      const invalidRequests =
        UpdateCategoryFixture.arrangeForEntityValidationError();
      const arrange = Object.keys(invalidRequests).map((key) => ({
        label: key,
        value: invalidRequests[key as keyof typeof invalidRequests],
      }));

      beforeEach(async () => {
        const category = Category.fake().aCategory().withCategoryId(id).build();
        await categoryRepository.insert(category);
      });

      it.each(arrange)(
        'when $label',
        async ({ value: { sentData, expected } }) => {
          const res = await request(appHelper.app.getHttpServer())
            .patch(`/categories/${id}`)
            .send(sentData)
            .expect(422)
            .expect('Content-Type', /json/);

          expect(res.body).toStrictEqual(expected);
        },
      );
    });

    describe('should create a category', () => {
      const arrange = UpdateCategoryFixture.arrangeForUpdate();

      beforeEach(async () => {
        const category = Category.fake().aCategory().withCategoryId(id).build();
        await categoryRepository.insert(category);
      });

      it.each(arrange)(
        'when body is $sentData',
        async ({ sentData, expected }) => {
          const res = await request(appHelper.app.getHttpServer())
            .patch(`/categories/${id}`)
            .send(sentData)
            .expect(200)
            .expect('Content-Type', /json/);

          const keysInResponse = CreateCategoryFixture.keysInResponse;
          expect(Object.keys(res.body)).toEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);

          const categoryUpdated = (await categoryRepository.findById(
            id,
          )) as Category;
          expect(categoryUpdated).toBeDefined();

          const presenter = CategoriesController.serialize(
            CategoryOutputMapper.toDTO(categoryUpdated),
          );
          const serialized = instanceToPlain(presenter);
          expect(res.body.data).toStrictEqual({
            id: serialized.id,
            createdAt: serialized.createdAt,
            name: expected.name ?? serialized.name,
            description:
              'description' in expected
                ? expected.description
                : serialized.description,
            isActive:
              'isActive' in expected ? expected.isActive : serialized.isActive,
          });
        },
      );
    });
  });
});
