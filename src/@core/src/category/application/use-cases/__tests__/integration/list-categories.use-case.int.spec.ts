import { ListCategoriesUseCase } from '#category/application';
import { CategoryTestBuilder } from '#category/domain/entitites/category.test-builder';
import { CategoryModel, CategorySequelizeRepository } from '#category/infra';
import { setupSequelize } from '#seedwork/tests';

const makeSut = () => {
  const categoryRepository = new CategorySequelizeRepository(CategoryModel);
  const sut = new ListCategoriesUseCase.UseCase(categoryRepository);
  return { sut, categoryRepository };
};
describe('ListCategoriesUseCase Unit Tests', () => {
  setupSequelize({ models: [CategoryModel] });
  describe('execute()', () => {
    it('should list all categories sorted by createdAt by default', async () => {
      const { sut, categoryRepository } = makeSut();
      const categories = CategoryTestBuilder.manyCategories(2)
        .withCreatedAt((i) => new Date(new Date().getTime() + i * 1000))
        .build();
      await categoryRepository.insertMany(categories);
      const result = await sut.execute({});
      expect(result).toStrictEqual({
        items: [categories[1].toJSON(), categories[0].toJSON()],
        total: 2,
        currentPage: 1,
        lastPage: 1,
        limit: 15,
      });
    });

    it('should list categories using pagination, sort, and filter', async () => {
      const { sut, categoryRepository } = makeSut();
      const categories = CategoryTestBuilder.manyCategories(9)
        .withName((i) => `Category ${i % 2 === 0 ? 'a' : 'b'} ${i}`)
        .withCreatedAt((i) => new Date(new Date().getTime() + i * 1000))
        .build();
      await categoryRepository.insertMany(categories);
      const dtos = categories.map((c) => c.toJSON());
      const arrange = [
        {
          input: { page: 1, limit: 3 },
          output: {
            items: [...dtos].reverse().slice(0, 3),
            total: 9,
            currentPage: 1,
            lastPage: 3,
            limit: 3,
          },
        },
        {
          input: { page: 2, limit: 3 },
          output: {
            items: [...dtos].reverse().slice(3, 6),
            total: 9,
            currentPage: 2,
            lastPage: 3,
            limit: 3,
          },
        },
        {
          input: { sort: 'name' as const, order: 'asc' as const, limit: 4 },
          output: {
            items: [dtos[0], dtos[2], dtos[4], dtos[6]],
            total: 9,
            currentPage: 1,
            lastPage: 3,
            limit: 4,
          },
        },
        {
          input: {
            sort: 'name' as const,
            order: 'desc' as const,
            limit: 3,
            page: 2,
          },
          output: {
            items: [dtos[1], dtos[8], dtos[6]],
            total: 9,
            currentPage: 2,
            lastPage: 3,
            limit: 3,
          },
        },
        {
          input: { filter: ' a ', limit: 3 },
          output: {
            items: [dtos[8], dtos[6], dtos[4]],
            total: 5,
            currentPage: 1,
            lastPage: 2,
            limit: 3,
          },
        },
        {
          input: {
            filter: ' b ',
            limit: 3,
            page: 2,
            sort: 'name' as const,
            order: 'asc' as const,
          },
          output: {
            items: [dtos[7]],
            total: 4,
            currentPage: 2,
            lastPage: 2,
            limit: 3,
          },
        },
      ];
      for (const i of arrange) {
        const result = await sut.execute(i.input);
        expect(result).toStrictEqual(i.output);
      }
    });
  });
});
