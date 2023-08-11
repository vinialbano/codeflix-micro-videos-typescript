import { Entity } from "../../entities/entity";
import { SearchResult, SearchResultProps } from "../search-result";

class StubEntity extends Entity {}

describe("SearchResult Unit Tests", () => {
  beforeEach(() => {
    SearchResult.validate = jest.fn().mockImplementation((props) => props);
  });
  describe("constructor()", () => {
    it("should validate the properties and create the instance with the returned values", () => {
      const props: SearchResultProps<StubEntity> = {
        items: [],
        total: 0,
        currentPage: 1,
        limit: 15,
        sort: null,
        order: null,
        filter: null,
      };
      const searchResult = new SearchResult(props as any, StubEntity);
      const validatedData = (SearchResult.validate as jest.Mock).mock.results[0]
        .value;
      expect(SearchResult.validate).toHaveBeenCalledTimes(1);
      expect(SearchResult.validate).toHaveBeenCalledWith(props, StubEntity);
      expect(searchResult.items).toBe(validatedData.items);
      expect(searchResult.total).toBe(validatedData.total);
      expect(searchResult.currentPage).toBe(validatedData.currentPage);
      expect(searchResult.limit).toBe(validatedData.limit);
      expect(searchResult.sort).toBe(validatedData.sort);
      expect(searchResult.order).toBe(validatedData.order);
      expect(searchResult.filter).toBe(validatedData.filter);
    });

    it("should throw if properties are invalid", () => {
      const props = {} as SearchResultProps<StubEntity>;
      (SearchResult.validate as jest.Mock).mockImplementationOnce(() => {
        throw new Error("Invalid properties");
      });
      expect(() => new SearchResult(props, StubEntity)).toThrow();
      expect(SearchResult.validate).toHaveBeenCalledTimes(1);
      expect(SearchResult.validate).toHaveBeenCalledWith(props, StubEntity);
    });

    it("should calculate the last page", () => {
      const arrange = [
        { total: 0, limit: 15, lastPage: 1 },
        { total: 15, limit: 15, lastPage: 1 },
        { total: 30, limit: 15, lastPage: 2 },
        { total: 45, limit: 15, lastPage: 3 },
        { total: 50, limit: 5, lastPage: 10 },
        { total: 49, limit: 5, lastPage: 10 },
      ];
      arrange.forEach(({ total, limit, lastPage }) => {
        const searchResult = new SearchResult(
          { total, limit } as any,
          StubEntity
        );
        expect(searchResult.lastPage).toBe(lastPage);
      });
    });
  });
});
