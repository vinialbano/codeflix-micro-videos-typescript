import { Entity } from "../entities/entity";
import { SearchParamsValidator } from "./search-params.validator";

export type SortOrder = "asc" | "desc";

export type SearchParamsProps<E extends Entity<any>, Filter = string> = {
  page?: number;
  limit?: number;
  sort?: "id" | keyof E["props"] | null;
  order?: SortOrder | null;
  filter?: Filter | null;
};

export class SearchParams<E extends Entity<any>, Filter = string> {
  protected props: SearchParamsProps<E, Filter>;

  constructor(props: SearchParamsProps<E, Filter> = {}) {
    this.props = {
      page: 1,
      limit: 15,
      sort: props.sort || null,
      order: props.sort ? props.order || "asc" : null,
      filter: props.filter || null,
      ...SearchParams.validate(props),
    };
  }

  static validate<E extends Entity<any>, Filter = string>(
    props: SearchParamsProps<E, Filter>
  ): SearchParamsProps<E, Filter> {
    const validator = new SearchParamsValidator();
    validator.validate(props);
    return validator.validatedData;
  }

  get page(): number {
    return this.props.page;
  }

  get limit(): number {
    return this.props.limit;
  }

  get sort(): "id" | keyof E["props"] | null {
    return this.props.sort;
  }

  get order(): SortOrder | null {
    return this.props.order;
  }

  get filter(): Filter | null {
    return this.props.filter;
  }
}
