import { Entity } from "../../domain/entities/entity";
import { SearchResult } from "../../domain/repositories/search-result";
import { PaginationOutputMapper } from "./pagination-output.mapper";

class StubEntity extends Entity<{}> {}

describe("PaginationOutputMapper", () => {
  describe("toDTO()", () => {
    it("should map a SearchResult to a PaginationOutputDTO", () => {
      const entity = new StubEntity({});
      const searchResult = new SearchResult<StubEntity>(
        {
          items: [entity],
          total: 1,
          currentPage: 1,
          limit: 1,
          filter: null,
          sort: null,
          order: null,
        },
        StubEntity
      );
      const toItemDTO = jest.fn().mockImplementation(() => ({}));
      const result = PaginationOutputMapper.toDTO(searchResult, toItemDTO);
      expect(result).toStrictEqual({
        items: [{}],
        total: 1,
        currentPage: 1,
        lastPage: 1,
        limit: 1
      });
      expect(toItemDTO).toHaveBeenCalledWith(entity);
    });
  });
});
