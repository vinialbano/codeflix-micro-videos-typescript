import {
  Entity,
  EntityPropsKeys,
  InMemorySearchableRepository,
  SearchParams,
  SearchResult,
} from "#seedwork/domain";

interface StubEntityProps {
  name: string;
  price: number;
}

class StubEntity extends Entity<StubEntityProps> {}

class StubRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: Array<EntityPropsKeys<StubEntity>> = ["name", "price"];

  protected async applyFilter(
    items: StubEntity[],
    filter: string | null
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }
    return items.filter((item) => {
      return (
        item.props.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.props.price.toString() === filter
      );
    });
  }
}

const makeSut = () => {
  const sut = new StubRepository(StubEntity);
  return { sut };
};

describe("InMemorySearchableRepository Unit Tests", () => {
  beforeEach(() => {
    SearchParams.validate = jest.fn().mockImplementation((v) => v);
    SearchResult.validate = jest.fn().mockImplementation((v) => v);
  });

  describe("applyFilter()", () => {
    it("should return all items if filter is null", async () => {
      const { sut } = makeSut();
      const items = [new StubEntity({ name: "name", price: 10 })];
      const spyFilter = jest.spyOn(items, "filter");
      const result = await sut["applyFilter"](items, null);
      expect(result).toStrictEqual(items);
      expect(spyFilter).not.toHaveBeenCalled();
    });

    it("should return filtered items", async () => {
      const { sut } = makeSut();
      const items = [
        new StubEntity({ name: "name", price: 10 }),
        new StubEntity({ name: "NAME", price: 10 }),
        new StubEntity({ name: "other", price: 20 }),
      ];
      const spyFilter = jest.spyOn(items, "filter");
      let result = await sut["applyFilter"](items, "name");
      expect(result).toStrictEqual([items[0], items[1]]);
      expect(spyFilter).toHaveBeenCalledTimes(1);

      result = await sut["applyFilter"](items, "10");
      expect(result).toStrictEqual([items[0], items[1]]);
      expect(spyFilter).toHaveBeenCalledTimes(2);

      result = await sut["applyFilter"](items, "wrong");
      expect(result).toStrictEqual([]);
      expect(spyFilter).toHaveBeenCalledTimes(3);
    });
  });

  describe("applySort()", () => {
    it("shoult not sort if sort is null", async () => {
      const { sut } = makeSut();
      const items = [
        new StubEntity({ name: "a", price: 10 }),
        new StubEntity({ name: "b", price: 10 }),
      ];
      const result = await sut["applySort"](items, null, null);
      expect(result).toStrictEqual(items);
    });

    it("shoult not sort if sort is not sortable", async () => {
      const { sut } = makeSut();
      const items = [
        new StubEntity({ name: "a", price: 10 }),
        new StubEntity({ name: "b", price: 10 }),
      ];
      const result = await sut["applySort"](items, "id", null);
      expect(result).toStrictEqual(items);
    });

    it("shoult sort asc", async () => {
      const { sut } = makeSut();
      const items = [
        new StubEntity({ name: "a", price: 10 }),
        new StubEntity({ name: "b", price: 5 }),
      ];
      let result = await sut["applySort"](items, "name", "asc");
      expect(result).toStrictEqual([items[0], items[1]]);

      result = await sut["applySort"](items, "price", "asc");
      expect(result).toStrictEqual([items[1], items[0]]);
    });

    it("shoult sort desc", async () => {
      const { sut } = makeSut();
      const items = [
        new StubEntity({ name: "a", price: 10 }),
        new StubEntity({ name: "b", price: 5 }),
      ];
      let result = await sut["applySort"](items, "name", "desc");
      expect(result).toStrictEqual([items[1], items[0]]);

      result = await sut["applySort"](items, "price", "desc");
      expect(result).toStrictEqual([items[0], items[1]]);
    });
  });

  describe("applyPagination()", () => {
    it("should paginate", async () => {
      const { sut } = makeSut();
      const items = [
        new StubEntity({ name: "a", price: 1 }),
        new StubEntity({ name: "b", price: 2 }),
        new StubEntity({ name: "c", price: 3 }),
        new StubEntity({ name: "d", price: 4 }),
        new StubEntity({ name: "e", price: 5 }),
        new StubEntity({ name: "f", price: 6 }),
      ];
      let result = await sut["applyPagination"](items, 1, 1);
      expect(result).toStrictEqual([items[0]]);

      result = await sut["applyPagination"](items, 2, 1);
      expect(result).toStrictEqual([items[1]]);

      result = await sut["applyPagination"](items, 2, 2);
      expect(result).toStrictEqual([items[2], items[3]]);

      result = await sut["applyPagination"](items, 6, 2);
      expect(result).toStrictEqual([]);
    });
  });

  describe("search()", () => {
    it("should apply only pagination when other params are null", async () => {
      const { sut } = makeSut();
      const entity = new StubEntity({ name: "a", price: 1 });
      const items = Array(16).fill(entity);
      sut.items = items;
      const arrange: any[] = [
        {
          params: undefined,
          result: {
            items: Array(15).fill(entity),
            total: 16,
            currentPage: 1,
            limit: 15,
            filter: null,
            sort: null,
            order: null,
          },
        },
        {
          params: { page: 2, limit: 2 },
          result: {
            items: [items[2], items[3]],
            total: 16,
            currentPage: 2,
            limit: 2,
            filter: null,
            sort: null,
            order: null,
          },
        },
      ];
      for (const i of arrange) {
        await expect(
          sut.search(new SearchParams<StubEntity>(i.params))
        ).resolves.toStrictEqual(new SearchResult(i.result, StubEntity));
      }
    });

    it("should apply paginate and filter when sort is null", async () => {
      const { sut } = makeSut();
      const items = [
        new StubEntity({ name: "a1", price: 1 }),
        new StubEntity({ name: "a2", price: 2 }),
        new StubEntity({ name: "b1", price: 2 }),
        new StubEntity({ name: "c1", price: 3 }),
      ];
      sut.items = items;
      const arrange: any[] = [
        {
          params: { filter: "a" },
          result: {
            items: [items[0], items[1]],
            total: 2,
            currentPage: 1,
            limit: 15,
            filter: "a",
            sort: null,
            order: null,
          },
        },
        {
          params: { filter: "a", limit: 1 },
          result: {
            items: [items[0]],
            total: 2,
            currentPage: 1,
            limit: 1,
            filter: "a",
            sort: null,
            order: null,
          },
        },
        {
          params: { filter: "a", limit: 1, page: 2 },
          result: {
            items: [items[1]],
            total: 2,
            currentPage: 2,
            limit: 1,
            filter: "a",
            sort: null,
            order: null,
          },
        },
      ];
      for (const i of arrange) {
        await expect(
          sut.search(new SearchParams<StubEntity>(i.params))
        ).resolves.toStrictEqual(new SearchResult(i.result, StubEntity));
      }
    });

    it("should apply paginate and sort, when filter is null", async () => {
      const { sut } = makeSut();
      const items = [
        new StubEntity({ name: "a1", price: 1 }),
        new StubEntity({ name: "b1", price: 2 }),
        new StubEntity({ name: "c1", price: 3 }),
        new StubEntity({ name: "a2", price: 2 }),
        new StubEntity({ name: "a3", price: 3 }),
      ];
      sut.items = items;
      const arrange: any[] = [
        {
          params: { sort: "name" },
          result: {
            items: [items[0], items[3], items[4], items[1], items[2]],
            total: 5,
            currentPage: 1,
            limit: 15,
            filter: null,
            sort: "name",
            order: "asc",
          },
        },
        {
          params: { sort: "name", order: "desc" },
          result: {
            items: [items[2], items[1], items[4], items[3], items[0]],
            total: 5,
            currentPage: 1,
            limit: 15,
            filter: null,
            sort: "name",
            order: "desc",
          },
        },
        {
          params: { sort: "name", limit: 1 },
          result: {
            items: [items[0]],
            total: 5,
            currentPage: 1,
            limit: 1,
            filter: null,
            sort: "name",
            order: "asc",
          },
        },
        {
          params: { sort: "name", order: "desc", limit: 1 },
          result: {
            items: [items[2]],
            total: 5,
            currentPage: 1,
            limit: 1,
            filter: null,
            sort: "name",
            order: "desc",
          },
        },
        {
          params: { sort: "name", limit: 1, page: 2 },
          result: {
            items: [items[3]],
            total: 5,
            currentPage: 2,
            limit: 1,
            filter: null,
            sort: "name",
            order: "asc",
          },
        },
        {
          params: { sort: "name", order: "desc", limit: 1, page: 2 },
          result: {
            items: [items[1]],
            total: 5,
            currentPage: 2,
            limit: 1,
            filter: null,
            sort: "name",
            order: "desc",
          },
        },
      ];
      for (const i of arrange) {
        await expect(
          sut.search(new SearchParams<StubEntity>(i.params))
        ).resolves.toStrictEqual(new SearchResult(i.result, StubEntity));
      }
    });

    it("should apply paginate, filter and sort", async () => {
      const { sut } = makeSut();
      const items = [
        new StubEntity({ name: "a1", price: 1 }),
        new StubEntity({ name: "b1", price: 2 }),
        new StubEntity({ name: "c1", price: 3 }),
        new StubEntity({ name: "a2", price: 2 }),
        new StubEntity({ name: "a3", price: 3 }),
      ];
      sut.items = items;
      const arrange = [
        {
          params: { filter: "a", sort: "name" },
          result: {
            items: [items[0], items[3], items[4]],
            total: 3,
            currentPage: 1,
            limit: 15,
            filter: "a",
            sort: "name",
            order: "asc",
          },
        },
        {
          params: { filter: "a", sort: "name", order: "desc" },
          result: {
            items: [items[4], items[3], items[0]],
            total: 3,
            currentPage: 1,
            limit: 15,
            filter: "a",
            sort: "name",
            order: "desc",
          },
        },
        {
          params: { filter: "a", sort: "name", limit: 1 },
          result: {
            items: [items[0]],
            total: 3,
            currentPage: 1,
            limit: 1,
            filter: "a",
            sort: "name",
            order: "asc",
          },
        },
        {
          params: {
            filter: "a",
            sort: "name",
            order: "desc",
            limit: 1,
            page: 2,
          },
          result: {
            items: [items[3]],
            total: 3,
            currentPage: 2,
            limit: 1,
            filter: "a",
            sort: "name",
            order: "desc",
          },
        },
      ];
      for (const i of arrange) {
        await expect(
          sut.search(new SearchParams<StubEntity>(i.params as any))
        ).resolves.toStrictEqual(new SearchResult(i.result as any, StubEntity));
      }
    });
  });
});
