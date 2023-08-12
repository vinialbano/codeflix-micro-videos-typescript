import { SearchParams } from "#seedwork/domain";

describe("SearchParams Integration Tests", () => {
  describe("constructor()", () => {
    it("should validate page value", () => {
      const arrange: any[] = [
        { given: null, expected: 1 },
        { given: undefined, expected: 1 },
        { given: "", expected: 1 },
        { given: "any", expected: 1 },
        { given: 0, expected: 1 },
        { given: -1, expected: 1 },
        { given: 1.5, expected: 1 },
        { given: true, expected: 1 },
        { given: false, expected: 1 },
        { given: {}, expected: 1 },
        { given: 1, expected: 1 },
        { given: 2, expected: 2 },
        { given: "1", expected: 1 },
        { given: "2", expected: 2 },
      ];
      arrange.forEach(({ given, expected }) => {
        const searchParams = new SearchParams({ page: given });
        expect(searchParams.page).toBe(expected);
      });
    });

    it("should validate limit value", () => {
      const arrange: any[] = [
        { given: null, expected: 15 },
        { given: undefined, expected: 15 },
        { given: "", expected: 15 },
        { given: "any", expected: 15 },
        { given: 0, expected: 15 },
        { given: -1, expected: 15 },
        { given: 1.5, expected: 15 },
        { given: true, expected: 15 },
        { given: false, expected: 15 },
        { given: {}, expected: 15 },
        { given: 1, expected: 1 },
        { given: 2, expected: 2 },
        { given: 10, expected: 10 },
        { given: "1", expected: 1 },
        { given: "2", expected: 2 },
      ];
      arrange.forEach(({ given, expected }) => {
        const searchParams = new SearchParams({ limit: given });
        expect(searchParams.limit).toBe(expected);
      });
    });

    it("should validate sort value", () => {
      const arrange: any[] = [
        { given: null, expected: null },
        { given: undefined, expected: null },
        { given: "", expected: null },
        { given: 0, expected: null },
        { given: -1, expected: null },
        { given: 1.5, expected: null },
        { given: true, expected: null },
        { given: false, expected: null },
        { given: {}, expected: null },
        { given: "field", expected: "field" },
        { given: " field ", expected: "field" },
      ];
      arrange.forEach(({ given, expected }) => {
        const searchParams = new SearchParams({ sort: given });
        expect(searchParams.sort).toBe(expected);
      });
    });

    it("should validate order value", () => {
      const arrange: any[] = [
        { given: { sort: null, order: "asc" }, expected: null },
        { given: { sort: null, order: "desc" }, expected: null },
        { given: { sort: undefined, order: "asc" }, expected: null },
        { given: { sort: undefined, order: "desc" }, expected: null },
        { given: { sort: "", order: "asc" }, expected: null },
        { given: { sort: "", order: "desc" }, expected: null },
        { given: { sort: "field", order: null }, expected: "asc" },
        { given: { sort: "field", order: undefined }, expected: "asc" },
        { given: { sort: "field", order: "" }, expected: "asc" },
        { given: { sort: "field", order: 0 }, expected: "asc" },
        { given: { sort: "field", order: "asc" }, expected: "asc" },
        { given: { sort: "field", order: "desc" }, expected: "desc" },
        { given: { sort: "field", order: "ASC" }, expected: "asc" },
        { given: { sort: "field", order: "DESC" }, expected: "desc" },
        { given: { sort: "field", order: "  ASC  " }, expected: "asc" },
      ];
      arrange.forEach(({ given, expected }) => {
        const searchParams = new SearchParams(given);
        expect(searchParams.order).toBe(expected);
      });
    });

    it("should validate filter value", () => {
      const arrange: any[] = [
        { given: null, expected: null },
        { given: undefined, expected: null },
        { given: "", expected: null },
        { given: 0, expected: null },
        { given: -1, expected: null },
        { given: 1.5, expected: null },
        { given: true, expected: null },
        { given: false, expected: null },
        { given: {}, expected: null },
        { given: "field", expected: "field" },
        { given: " field ", expected: "field" },
      ];
      arrange.forEach(({ given, expected }) => {
        const searchParams = new SearchParams({ filter: given });
        expect(searchParams.filter).toBe(expected);
      });
    });
  });
});
