import { Category, CategoryRepository } from '#category/domain';
import { CategoryInMemoryRepository } from '#category/infra';

const makeSut = () => {
  const sut = new CategoryInMemoryRepository();
  return { sut };
};

describe('CategoryInMemoryRepository Unit Tests', () => {
  beforeEach(() => {
    CategoryRepository.SearchParams.validate = jest
      .fn()
      .mockImplementation((v) => v);
    CategoryRepository.SearchResult.validate = jest
      .fn()
      .mockImplementation((v) => v);
  });

  describe('applyFilter()', () => {
    it('should do a full-text search by name', async () => {
      const { sut } = makeSut();
      const category1 = new Category({ name: 'Movie' });
      const category2 = new Category({ name: 'Series' });
      sut.items = [category1, category2];
      let result = await sut['applyFilter'](sut.items, 'Movie');
      expect(result).toStrictEqual([category1]);

      result = await sut['applyFilter'](sut.items, 'E');
      expect(result).toStrictEqual([category1, category2]);
    });
  });

  describe('applySort()', () => {
    it('should sort by createdAt desc by default', async () => {
      const { sut } = makeSut();
      const category1 = new Category({
        name: 'Movie',
        createdAt: new Date(2021, 1, 1),
      });
      const category2 = new Category({
        name: 'Series',
        createdAt: new Date(2021, 1, 2),
      });
      sut.items = [category1, category2];
      const result = await sut['applySort'](sut.items, null, null);
      expect(result).toStrictEqual([category2, category1]);
    });

    it('should be sortable by name, description, createdAt, isActive and id', async () => {
      const { sut } = makeSut();
      const category1 = new Category({
        name: 'Movie',
        description: 'Movie description',
        createdAt: new Date(2021, 1, 2),
      });
      const category2 = new Category({
        name: 'Series',
        description: 'A great description',
        createdAt: new Date(2021, 1, 1),
        isActive: false,
      });
      sut.items = [category1, category2];
      const arrange: any[] = [
        {
          sort: 'name',
          expected: [category1, category2],
        },
        {
          sort: 'description',
          expected: [category2, category1],
        },
        {
          sort: 'createdAt',
          expected: [category2, category1],
        },
        {
          sort: 'isActive',
          expected: [category2, category1],
        },
        {
          sort: 'id',
          expected: [category1, category2],
        },
      ];
      for (const i of arrange) {
        const result = await sut['applySort'](sut.items, i.sort, 'asc');
        expect(result).toStrictEqual(i.expected);
      }
    });
  });

  describe('search()', () => {
    it('sorts by createdAt desc by default', async () => {
      const { sut } = makeSut();
      const category1 = new Category({
        name: 'Movie',
        createdAt: new Date(2021, 1, 1),
      });
      const category2 = new Category({
        name: 'Series',
        createdAt: new Date(2021, 1, 2),
      });
      sut.items = [category1, category2];
      const result = await sut.search(new CategoryRepository.SearchParams());
      expect(result.items).toStrictEqual([category2, category1]);
    });
  });
});
