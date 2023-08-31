import { CategoryRepository } from '#category/domain';
import { CategoryTestBuilder } from '#category/domain/entitites/category.test-builder';
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
      const builder = CategoryTestBuilder.aCategory();
      const category1 = builder.withName('Movie').build();
      const category2 = builder.withName('Series').build();
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
      const builder = CategoryTestBuilder.aCategory();
      const category1 = builder.withCreatedAt(new Date(2021, 1, 1)).build();
      const category2 = builder.withCreatedAt(new Date(2021, 1, 2)).build();
      sut.items = [category1, category2];
      const result = await sut['applySort'](sut.items, null, null);
      expect(result).toStrictEqual([category2, category1]);
    });

    it('should be sortable by name, description, createdAt, isActive and id', async () => {
      const { sut } = makeSut();
      const builder = CategoryTestBuilder.aCategory();
      const category1 = builder
        .withName('A')
        .withDescription('B')
        .withCreatedAt(new Date(2021, 1, 2))
        .active()
        .build();

      const category2 = builder
        .withName('B')
        .withDescription('A')
        .withCreatedAt(new Date(2021, 1, 1))
        .inactive()
        .build();
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
      const builder = CategoryTestBuilder.aCategory();

      const category1 = builder.withCreatedAt(new Date(2021, 1, 1)).build();
      const category2 = builder.withCreatedAt(new Date(2021, 1, 2)).build();
      sut.items = [category1, category2];
      const result = await sut.search(new CategoryRepository.SearchParams());
      expect(result.items).toStrictEqual([category2, category1]);
    });
  });
});
