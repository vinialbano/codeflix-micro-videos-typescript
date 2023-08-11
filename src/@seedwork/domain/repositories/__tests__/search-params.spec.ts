import { Entity } from "../../entities/entity";
import { SearchParams, SearchParamsProps } from "../search-params";

class StubEntity extends Entity<{ prop: string }> {
  get prop(): string {
    return this._props.prop;
  }
}

describe("SearchParams Unit Tests", () => {
  beforeEach(() => {
    SearchParams.validate = jest.fn().mockImplementation((props) => props);
  });
  describe("constructor()", () => {
    it("should create a new instance with default properties", () => {
      const searchParams = new SearchParams();
      expect(searchParams).toBeDefined();
      expect(searchParams.page).toBe(1);
      expect(searchParams.limit).toBe(15);
      expect(searchParams.sort).toBeNull();
      expect(searchParams.order).toBeNull();
      expect(searchParams.filter).toBeNull();
    });

    it("should validate the properties and create the instance with the returned values", () => {
      const props: SearchParamsProps<StubEntity> = {
        page: 2,
        limit: 20,
        sort: "prop",
        order: "asc",
        filter: "any_filter",
      };
      const searchParams = new SearchParams(props);
      const validatedValues = (SearchParams.validate as jest.Mock).mock
        .results[0].value;

      expect(SearchParams.validate).toBeCalledTimes(1);
      expect(SearchParams.validate).toBeCalledWith(props);
      expect(searchParams.page).toBe(validatedValues.page);
      expect(searchParams.limit).toBe(validatedValues.limit);
      expect(searchParams.sort).toBe(validatedValues.sort);
      expect(searchParams.order).toBe(validatedValues.order);
      expect(searchParams.filter).toBe(validatedValues.filter);
    });
  });
});
