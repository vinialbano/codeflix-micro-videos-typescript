import request from 'supertest';
import { CategoryRepository } from '@core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from '../../src/nest-modules/categories-module/categories.providers';
import { startApp } from '../helpers';
import { Category, CategoryId } from '@core/category/domain/category.aggregate';

describe('CategoriesController (e2e)', () => {
  const appHelper = startApp();
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    categoryRepository = appHelper.app.get<CategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });

  describe('DELETE /categories/:id', () => {
    it('should return a response error with 422 status code when id is invalid', async () => {
      const res = await request(appHelper.app.getHttpServer())
        .delete('/categories/invalid_id')
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
        .delete(`/categories/${id}`)
        .expect(404)
        .expect('Content-Type', /json/);

      expect(res.body).toStrictEqual({
        statusCode: 404,
        error: 'Not Found',
        message: `Entity Category not found with id(s): ${id}`,
      });
    });

    it('should delete a category and respond with status 204', async () => {
      const category = Category.fake().aCategory().build();
      await categoryRepository.insert(category);

      await request(appHelper.app.getHttpServer())
        .delete(`/categories/${category.categoryId.id}`)
        .expect(204);

      await expect(
        categoryRepository.findById(category.categoryId),
      ).resolves.toBeNull();
    });
  });
});
