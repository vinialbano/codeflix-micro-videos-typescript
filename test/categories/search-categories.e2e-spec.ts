import request from 'supertest';
import { CategoryRepository } from '@core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from '../../src/nest-modules/categories-module/categories.providers';
import { startApp } from '../helpers';
import { ListCategoriesFixture } from '../../src/nest-modules/categories-module/__tests__/category-fixture';
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

  describe('GET /categories', () => {
    describe('should return categories sorted by createdAt by default when query is empty', () => {
      const { entitiesMap, arrange } =
        ListCategoriesFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        await categoryRepository.insertMany(Object.values(entitiesMap));
      });

      it.each(arrange)(
        'when query params are $sentData',
        async ({ sentData, expected }) => {
          const queryParams = new URLSearchParams(sentData as any).toString();
          const res = await request(appHelper.app.getHttpServer())
            .get(`/categories/?${queryParams}`)
            .expect(200)
            .expect('Content-Type', /json/);

          expect(res.body).toStrictEqual({
            data: expected.entities.map((e) =>
              instanceToPlain(
                CategoriesController.serialize(CategoryOutputMapper.toDTO(e)),
              ),
            ),
            meta: expected.meta,
          });
        },
      );
    });

    describe('should return categories using paginate, filter, and sort', () => {
      const { entitiesMap, arrange } = ListCategoriesFixture.arrangeUnsorted();

      beforeEach(async () => {
        await categoryRepository.insertMany(Object.values(entitiesMap));
      });

      it.each(arrange)(
        'when query params are $sentData',
        async ({ sentData, expected }) => {
          const queryParams = new URLSearchParams(sentData as any).toString();
          const res = await request(appHelper.app.getHttpServer())
            .get(`/categories/?${queryParams}`)
            .expect(200)
            .expect('Content-Type', /json/);

          expect(res.body).toStrictEqual({
            data: expected.entities.map((e) =>
              instanceToPlain(
                CategoriesController.serialize(CategoryOutputMapper.toDTO(e)),
              ),
            ),
            meta: expected.meta,
          });
        },
      );
    });
  });
});
