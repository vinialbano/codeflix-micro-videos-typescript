import { ListCategoriesUseCase } from '#category/application';
import { Category } from '#category/domain';
import { CategoryInMemoryRepository } from '#category/infra';

const makeSut = () => {
  const categoryRepository = new CategoryInMemoryRepository();
  const sut = new ListCategoriesUseCase.UseCase(categoryRepository);
  return { sut, categoryRepository };
};

describe('ListCategoriesUseCase Unit Tests', () => {
  describe('execute()', () => {
    it('should list all categories sorted by createdAt by default', async () => {
      const { sut, categoryRepository } = makeSut();
      const items = [
        new Category({
          name: 'A',
          createdAt: new Date(2021, 1, 1),
        }),
        new Category({
          name: 'B',
          createdAt: new Date(2021, 1, 2),
        }),
      ];
      categoryRepository.items = items;
      const result = await sut.execute({});
      expect(result).toStrictEqual({
        items: [items[1].toJSON(), items[0].toJSON()],
        total: 2,
        currentPage: 1,
        lastPage: 1,
        limit: 15,
      });
    });

    it('should list categories using pagination, sort, and filter', async () => {
      const { sut, categoryRepository } = makeSut();
      const items = [
        new Category({ name: 'A', createdAt: new Date(2021, 1, 1) }),
        new Category({ name: 'B', createdAt: new Date(2021, 1, 2) }),
        new Category({ name: 'a', createdAt: new Date(2021, 1, 3) }),
        new Category({ name: 'b', createdAt: new Date(2021, 1, 4) }),
        new Category({ name: 'Aa', createdAt: new Date(2021, 1, 5) }),
        new Category({ name: 'Ab', createdAt: new Date(2021, 1, 6) }),
        new Category({ name: 'Ba', createdAt: new Date(2021, 1, 7) }),
        new Category({ name: 'Bb', createdAt: new Date(2021, 1, 8) }),
        new Category({ name: 'AA', createdAt: new Date(2021, 1, 9) }),
        new Category({ name: 'AB', createdAt: new Date(2021, 1, 10) }),
        new Category({ name: 'BA', createdAt: new Date(2021, 1, 11) }),
        new Category({ name: 'BB', createdAt: new Date(2021, 1, 12) }),
      ];
      categoryRepository.items = items;
      const arrange = [
        {
          input: { page: 1, limit: 3 },
          output: {
            items: [items[11].toJSON(), items[10].toJSON(), items[9].toJSON()],
            total: 12,
            currentPage: 1,
            lastPage: 4,
            limit: 3,
          },
        },
        {
          input: { page: 2, limit: 3 },
          output: {
            items: [items[8].toJSON(), items[7].toJSON(), items[6].toJSON()],
            total: 12,
            currentPage: 2,
            lastPage: 4,
            limit: 3,
          },
        },
        {
          input: { sort: 'name' as const, order: 'asc' as const, limit: 3 },
          output: {
            items: [items[0].toJSON(), items[8].toJSON(), items[9].toJSON()],
            total: 12,
            currentPage: 1,
            lastPage: 4,
            limit: 3,
          },
        },
        {
          input: {
            sort: 'name' as const,
            order: 'desc' as const,
            limit: 3,
            page: 3,
          },
          output: {
            items: [items[1].toJSON(), items[5].toJSON(), items[4].toJSON()],
            total: 12,
            currentPage: 3,
            lastPage: 4,
            limit: 3,
          },
        },
        {
          input: { filter: 'a', limit: 3 },
          output: {
            items: [items[10].toJSON(), items[9].toJSON(), items[8].toJSON()],
            total: 8,
            currentPage: 1,
            lastPage: 3,
            limit: 3,
          },
        },
        {
          input: {
            filter: 'b',
            limit: 3,
            page: 2,
            sort: 'name' as const,
            order: 'asc' as const,
          },
          output: {
            items: [items[10].toJSON(), items[11].toJSON(), items[6].toJSON()],
            total: 8,
            currentPage: 2,
            lastPage: 3,
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
