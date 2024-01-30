import request from 'supertest';
import { CategoryRepository } from '@core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from '../../src/nest-modules/categories-module/categories.providers';
import { startApp } from '../helpers';
import { GetCategoryFixture } from '../../src/nest-modules/categories-module/__tests__/category-fixture';
import { CategoriesController } from '../../src/nest-modules/categories-module/categories.controller';
import { CategoryOutputMapper } from '@core/category/application/use-cases/shared/category-output';
import { instanceToPlain } from 'class-transformer';
import { Category, CategoryId } from '@core/category/domain/category.aggregate';

describe('CategoriesController (e2e)', () => {
  const appHelper = startApp();
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    categoryRepository = appHelper.app.get<CategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });

  describe('GET /categories/:id', () => {
    it('should return a response error with 422 status code when id is invalid', async () => {
      const res = await request(appHelper.app.getHttpServer())
        .get('/categories/invalid_id')
        .expect(422)
        .expect('Content-Type', /json/);

      expect(res.body).toStrictEqual({
        statusCode: 422,
        message: 'Validation failed (uuid is expected)',
        error: 'Unprocessable Entity',
      });
    });

    it('should return a response error with 404 status code when entity is not found', async () => {
      const id = new CategoryId().toString();
      const res = await request(appHelper.app.getHttpServer())
        .get(`/categories/${id}`)
        .expect(404)
        .expect('Content-Type', /json/);

      expect(res.body).toStrictEqual({
        statusCode: 404,
        error: 'Not Found',
        message: `Entity Category not found with id(s): ${id}`,
      });
    });

    it('should return a category response with status 200', async () => {
      const category = Category.fake().aCategory().build();
      await categoryRepository.insert(category);

      const res = await request(appHelper.app.getHttpServer())
        .get(`/categories/${category.categoryId.id}`)
        .expect(200);

      const keysInResponse = GetCategoryFixture.keysInResponse;
      expect(Object.keys(res.body)).toStrictEqual(['data']);
      expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);

      const presenter = CategoriesController.serialize(
        CategoryOutputMapper.toDTO(category),
      );
      const serialized = instanceToPlain(presenter);
      expect(res.body.data).toStrictEqual(serialized);
    });
  });
});
