import { ValidationError } from "../../errors/validation.error";
import { SearchResult } from "../search-result";

describe("SearchResult Unit Tests", () => {
  describe("constructor()", () => {
    const assertions = [
      {
        given: {
          total: 4,
          limit: 15,
        },
        expected: 1,
      },
      {
        given: {
          total: 4,
          limit: 1,
        },
        expected: 4,
      },
      {
        given: {
          total: 0,
          limit: 15,
        },
        expected: 1,
      },
    ];
    it.each(assertions)(
      "should create a SearchResult instance with $given and set last page = $expected",
      ({ given, expected }) => {
        const searchResult = new SearchResult({
          items: [],
          currentPage: 1,
          total: given.total,
          limit: given.limit,
        });
        expect(searchResult.total).toBe(given.total);
        expect(searchResult.items).toEqual([]);
        expect(searchResult.currentPage).toBe(1);
        expect(searchResult.limit).toBe(given.limit);
        expect(searchResult.lastPage).toBe(expected);
      }
    );
  });

  describe("toJSON()", () => {
    it("should return a JSON object with the SearchResult properties", () => {
      const searchResult = new SearchResult({
        items: [],
        currentPage: 1,
        total: 4,
        limit: 15,
      });
      expect(searchResult.toJSON()).toEqual({
        items: [],
        currentPage: 1,
        total: 4,
        limit: 15,
        lastPage: 1,
      });
    });

    it("should return a JSON object with the SearchResult properties and the items as JSON objects", () => {
      const searchResult = new SearchResult({
        items: [
          {
            toJSON: () => ({
              id: "123",
              name: "test",
            }),
          } as any,
        ],
        currentPage: 1,
        total: 4,
        limit: 15,
      });
      expect(searchResult.toJSON(true)).toEqual({
        items: [
          {
            id: "123",
            name: "test",
          },
        ],
        currentPage: 1,
        total: 4,
        limit: 15,
        lastPage: 1,
      });
    });
  });
});
