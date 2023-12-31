import { Entity } from "../../../domain/entity";
import { SearchParams } from "../../../domain/repository/search-params";
import { UUID } from "../../../domain/value-objects/uuid.vo";
import { InMemorySearchableRepository } from "../in-memory-searchable.repository";

class StubEntity extends Entity {
  entityId: UUID;
  name: string;
  constructor(name: string) {
    super();
    this.name = name;
    this.entityId = new UUID();
  }

  toJSON() {
    return {
      name: this.name,
      entityId: this.entityId.id,
    };
  }
}

class InMemorySearchableRepositoryStub extends InMemorySearchableRepository<
  StubEntity,
  UUID
> {
  sortableFields: string[] = ["name"];

  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }

  protected async applyFilter(
    items: StubEntity[],
    filter: string | null
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }
    return items.filter((item) =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }
}

describe("InMemorySearchableRepository Unit Tests", () => {
  describe("applyFilter()", () => {
    it("should return all items if filter is null", async () => {
      const repository = new InMemorySearchableRepositoryStub();
      const items = [
        new StubEntity("John"),
        new StubEntity("Doe"),
        new StubEntity("Jane"),
      ];
      const filteredItems = await repository["applyFilter"](items, null);
      expect(filteredItems).toEqual(items);
    });

    it("should return filtered items if filter is not null", async () => {
      const repository = new InMemorySearchableRepositoryStub();
      const items = [
        new StubEntity("John"),
        new StubEntity("Doe"),
        new StubEntity("Jane"),
      ];
      const filteredItems = await repository["applyFilter"](items, "doe");
      expect(filteredItems).toEqual([items[1]]);
    });
  });

  describe("applySort()", () => {
    it("should return all items if sort is null", () => {
      const repository = new InMemorySearchableRepositoryStub();
      const items = [
        new StubEntity("John"),
        new StubEntity("Doe"),
        new StubEntity("Jane"),
      ];
      const sortedItems = repository["applySort"](items, null, null);
      expect(sortedItems).toEqual(items);
    });

    it("should return all items if sort is not in sortableFields", () => {
      const repository = new InMemorySearchableRepositoryStub();
      const items = [
        new StubEntity("John"),
        new StubEntity("Doe"),
        new StubEntity("Jane"),
      ];
      const sortedItems = repository["applySort"](items, "age", "asc");
      expect(sortedItems).toEqual(items);
    });

    it("should return sorted items if sort is in sortableFields", () => {
      const repository = new InMemorySearchableRepositoryStub();
      const items = [
        new StubEntity("John"),
        new StubEntity("Doe"),
        new StubEntity("Jane"),
      ];
      const sortedItems = repository["applySort"](items, "name", "asc");
      expect(sortedItems).toEqual([items[1], items[2], items[0]]);
    });

    it("should return sorted items if sort is in sortableFields and sortDirection is desc", () => {
      const repository = new InMemorySearchableRepositoryStub();
      const items = [
        new StubEntity("John"),
        new StubEntity("John"),
        new StubEntity("Doe"),
        new StubEntity("Jane"),
      ];
      const sortedItems = repository["applySort"](items, "name", "desc");
      expect(sortedItems).toEqual([items[0], items[1], items[3], items[2]]);
    });

    it("should return sorted items if sort is in sortableFields and customGetter is provided", () => {
      const repository = new InMemorySearchableRepositoryStub();
      const items = [
        new StubEntity("John"),
        new StubEntity("Doe"),
        new StubEntity("Jane"),
      ];
      const sortedItems = repository["applySort"](
        items,
        "name",
        "asc",
        (sort, item) => item.name.toLowerCase()
      );
      expect(sortedItems).toEqual([items[1], items[2], items[0]]);
    });

    it("should return sorted items if sort is in sortableFields and sortDirection is desc and customGetter is provided", () => {
      const repository = new InMemorySearchableRepositoryStub();
      const items = [
        new StubEntity("A"),
        new StubEntity("a"),
        new StubEntity("B"),
      ];
      const sortedItems = repository["applySort"](
        items,
        "name",
        "desc",
        (sort, item) => item.name.toLowerCase()
      );
      expect(sortedItems).toEqual([items[2], items[0], items[1]]);
    });
  });

  describe("applyPagination()", () => {
    it("should return paginated items", () => {
      const repository = new InMemorySearchableRepositoryStub();
      const items = [
        new StubEntity("John"),
        new StubEntity("Doe"),
        new StubEntity("Jane"),
        new StubEntity("Jack"),
        new StubEntity("Jill"),
      ];
      const paginatedItems = repository["applyPagination"](items, 2, 2);
      expect(paginatedItems).toEqual([items[2], items[3]]);
    });
  });

  describe("search()", () => {
    it("should only paginate when no parameters are provided", async () => {
      const repository = new InMemorySearchableRepositoryStub();
      const items = new Array(16).fill(new StubEntity("John"));
      repository.items = items;
      const searchResult = await repository.search(new SearchParams());
      expect(searchResult.items).toEqual(items.slice(0, 15));
      expect(searchResult.total).toEqual(16);
      expect(searchResult.currentPage).toEqual(1);
      expect(searchResult.limit).toEqual(15);
    });

    it("should only paginate when other parameters are null", async () => {
      const repository = new InMemorySearchableRepositoryStub();
      const items = [
        new StubEntity("John"),
        new StubEntity("Doe"),
        new StubEntity("Jane"),
        new StubEntity("Jack"),
        new StubEntity("Jill"),
      ];
      repository.items = items;
      const searchResult = await repository.search(
        new SearchParams({
          page: 2,
          limit: 2,
        })
      );
      expect(searchResult.items).toEqual([items[2], items[3]]);
      expect(searchResult.total).toEqual(5);
      expect(searchResult.currentPage).toEqual(2);
      expect(searchResult.limit).toEqual(2);
    });

    it("should only sort and paginate when other parameters are null", async () => {
      const repository = new InMemorySearchableRepositoryStub();
      const items = [
        new StubEntity("Jane"),
        new StubEntity("Jack"),
        new StubEntity("Jill"),
        new StubEntity("John"),
        new StubEntity("Doe"),
      ];
      repository.items = items;
      const searchResult = await repository.search(
        new SearchParams({
          page: 2,
          limit: 2,
          sort: "name",
          sortDirection: "asc",
        })
      );
      expect(searchResult.items).toEqual([items[0], items[2]]);
      expect(searchResult.total).toEqual(5);
      expect(searchResult.currentPage).toEqual(2);
      expect(searchResult.limit).toEqual(2);
    });

    it("should only filter and paginate when other parameters are null", async () => {
      const repository = new InMemorySearchableRepositoryStub();
      const items = [
        new StubEntity("Jane"),
        new StubEntity("Jack"),
        new StubEntity("Jill"),
        new StubEntity("John"),
        new StubEntity("Doe"),
      ];
      repository.items = items;
      const searchResult = await repository.search(
        new SearchParams({
          page: 2,
          limit: 2,
          filter: "j",
        })
      );
      expect(searchResult.items).toEqual([items[2], items[3]]);
      expect(searchResult.total).toEqual(4);
      expect(searchResult.currentPage).toEqual(2);
      expect(searchResult.limit).toEqual(2);
    });

    it("should filter, sort and paginate", async () => {
      const repository = new InMemorySearchableRepositoryStub();
      const items = [
        new StubEntity("Jane"),
        new StubEntity("Jack"),
        new StubEntity("Jill"),
        new StubEntity("John"),
        new StubEntity("Doe"),
      ];
      repository.items = items;
      const searchResult = await repository.search(
        new SearchParams({
          page: 2,
          limit: 2,
          filter: "j",
          sort: "name",
          sortDirection: "asc",
        })
      );
      expect(searchResult.items).toEqual([items[2], items[3]]);
      expect(searchResult.total).toEqual(4);
      expect(searchResult.currentPage).toEqual(2);
      expect(searchResult.limit).toEqual(2);
    });
  });
});
