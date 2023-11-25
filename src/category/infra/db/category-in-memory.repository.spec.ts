import { Category } from "../../domain/category.entity";
import { CategoryInMemoryRepository } from "./category-in-memory.repository";

describe("CategoryInMemoryRepository", () => {
  describe("getEntity()", () => {
    it("should return Category", () => {
      const repository = new CategoryInMemoryRepository();
      expect(repository.getEntity()).toEqual(Category);
    });
  });

  describe("applyFilter()", () => {
    it("should return all items if filter is null", async () => {
      const repository = new CategoryInMemoryRepository();
      const items = [
        new Category({ name: "John" }),
        new Category({ name: "Doe" }),
        new Category({ name: "Jane" }),
      ];
      const filteredItems = await repository["applyFilter"](items, null);
      expect(filteredItems).toEqual(items);
    });

    it("should return filtered items by name", async () => {
      const repository = new CategoryInMemoryRepository();
      const items = [
        new Category({ name: "John" }),
        new Category({ name: "Doe" }),
        new Category({ name: "Jane" }),
      ];
      const filteredItems = await repository["applyFilter"](items, "doe");
      expect(filteredItems).toEqual([items[1]]);
    });
  });

  describe("applySort()", () => {
    it("should sort by createdAt desc if sort is null", () => {
      const repository = new CategoryInMemoryRepository();
      const items = [
        new Category({ name: "John", createdAt: new Date(2021, 1, 1) }),
        new Category({ name: "Doe", createdAt: new Date(2021, 1, 2) }),
        new Category({ name: "Jane", createdAt: new Date(2021, 1, 3) }),
      ];
      const sortedItems = repository["applySort"](items, null, null);
      expect(sortedItems).toEqual([items[2], items[1], items[0]]);
    });

    it("should sort using the given parameters", async () => {
      const repository = new CategoryInMemoryRepository();
      const items = [
        new Category({ name: "John" }),
        new Category({ name: "Doe" }),
        new Category({ name: "Jane" }),
      ];
      const sortedItems = repository["applySort"](items, "name", "desc");
      expect(sortedItems).toEqual([items[0], items[2], items[1]]);

      const sortedItems2 = repository["applySort"](items, "name", "asc");
      expect(sortedItems2).toEqual([items[1], items[2], items[0]]);
    });
  });
});
