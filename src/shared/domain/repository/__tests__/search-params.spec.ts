import { SearchParams } from "../search-params";

describe("SearchParams Unit Tests", () => {
  describe("constructor()", () => {
    it("should create a SearchParams instance with default values", () => {
      const searchParams = new SearchParams();
      expect(searchParams.page).toBe(1);
      expect(searchParams.limit).toBe(15);
      expect(searchParams.sort).toBeNull();
      expect(searchParams.sortDirection).toBeNull();
      expect(searchParams.filter).toBeNull();
    });

    const pageTestCases = [
      { given: undefined, expected: 1 },
      { given: null, expected: 1 },
      { given: "", expected: 1 },
      { given: "page", expected: 1 },
      { given: "1", expected: 1 },
      { given: "1.1", expected: 1 },
      { given: 0, expected: 1 },
      { given: -1, expected: 1 },
      { given: 2.1, expected: 1 },
      { given: true, expected: 1 },
      { given: false, expected: 1 },
      { given: 2, expected: 2 },
      { given: "2", expected: 2 },
    ];
    it.each(pageTestCases)(
      "should create a SearchParams instance with page = $expected, given $given",
      ({ given, expected }) => {
        const searchParams = new SearchParams({ page: given as any });
        expect(searchParams.page).toBe(expected);
      }
    );

    const limitTestCases = [
      { given: undefined, expected: 15 },
      { given: null, expected: 15 },
      { given: "", expected: 15 },
      { given: "limit", expected: 15 },
      { given: "1.1", expected: 15 },
      { given: 0, expected: 15 },
      { given: -1, expected: 15 },
      { given: 2.1, expected: 15 },
      { given: true, expected: 15 },
      { given: false, expected: 15 },
      { given: 1, expected: 1 },
      { given: 2, expected: 2 },
      { given: "2", expected: 2 },
    ];
    it.each(limitTestCases)(
      "should create a SearchParams instance with limit = $expected, given $given",
      ({ given, expected }) => {
        const searchParams = new SearchParams({ limit: given as any });
        expect(searchParams.limit).toBe(expected);
      }
    );

    const sortTestCases = [
      { given: undefined, expected: null },
      { given: null, expected: null },
      { given: "", expected: null },
      { given: "sort", expected: "sort" },
      { given: 1, expected: "1" },
      { given: 1.1, expected: "1.1" },
      { given: true, expected: "true" },
      { given: false, expected: "false" },
    ];
    it.each(sortTestCases)(
      "should create a SearchParams instance with sort = $expected, given $given",
      ({ given, expected }) => {
        const searchParams = new SearchParams({ sort: given as any });
        expect(searchParams.sort).toBe(expected);
      }
    );

    const sortDirectionTestCases = [
      { given: undefined, expected: "asc" },
      { given: null, expected: "asc" },
      { given: "", expected: "asc" },
      { given: "sortDirection", expected: "asc" },
      { given: 1, expected: "asc" },
      { given: 1.1, expected: "asc" },
      { given: true, expected: "asc" },
      { given: false, expected: "asc" },
      { given: "asc", expected: "asc" },
      { given: "desc", expected: "desc" },
      { given: "ASC", expected: "asc" },
      { given: "DESC", expected: "desc" },
    ];
    it.each(sortDirectionTestCases)(
      "should create a SearchParams instance with sortDirection = $expected, given $given, with sort = 'prop'",
      ({ given, expected }) => {
        const searchParams = new SearchParams({
          sortDirection: given as any,
          sort: "prop",
        });
        expect(searchParams.sortDirection).toBe(expected);
      }
    );

    const sortDirectionNullTestCases = [
      { given: undefined, expected: null },
      { given: null, expected: null },
      { given: "", expected: null },
      { given: "sortDirection", expected: null },
      { given: 1, expected: null },
      { given: 1.1, expected: null },
      { given: true, expected: null },
      { given: false, expected: null },
      { given: "asc", expected: null },
      { given: "desc", expected: null },
      { given: "ASC", expected: null },
      { given: "DESC", expected: null },
    ];
    it.each(sortDirectionNullTestCases)(
      "should create a SearchParams instance with sortDirection = $expected, given $given, with sort = null",
      ({ given, expected }) => {
        const searchParams = new SearchParams({
          sortDirection: given as any,
          sort: null,
        });
        expect(searchParams.sortDirection).toBe(expected);
      }
    );

    const filterTestCases = [
      { given: undefined, expected: null },
      { given: null, expected: null },
      { given: "", expected: null },
      { given: "filter", expected: "filter" },
      { given: 1, expected: "1" },
      { given: 1.1, expected: "1.1" },
      { given: true, expected: "true" },
      { given: false, expected: "false" },
    ];
    it.each(filterTestCases)(
      "should create a SearchParams instance with filter = $expected, given $given",
      ({ given, expected }) => {
        const searchParams = new SearchParams({ filter: given as any });
        expect(searchParams.filter).toBe(expected);
      }
    );
  });
});
