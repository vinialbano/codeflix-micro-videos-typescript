import { Entity, EntityPropsKeys } from "../entities";
import { RepositoryValidationError } from "../errors";
import { SearchResultValidator } from "./search-result.validator";

type SortOrder = "asc" | "desc";

export type SearchResultProps<E extends Entity, Filter = string> = {
  items: E[];
  total: number;
  currentPage: number;
  limit: number;
  sort: "id" | EntityPropsKeys<E> | null;
  order: SortOrder | null;
  filter: Filter | null;
};

export class SearchResult<E extends Entity, Filter = string> {
  protected props: SearchResultProps<E, Filter> & {
    lastPage: number;
  };

  constructor(
    props: SearchResultProps<E, Filter>,
    itemsClass: new (...args: any[]) => E
  ) {
    const validatedProps = SearchResult.validate(props, itemsClass);
    this.props = {
      ...validatedProps,
      lastPage: Math.ceil(validatedProps.total / validatedProps.limit) || 1,
    };
  }

  static validate<E extends Entity, Filter = string>(
    props: SearchResultProps<E, Filter>,
    itemsClass: new (...args: any[]) => E
  ): SearchResultProps<E, Filter> {
    const validator = new SearchResultValidator<E, Filter>(itemsClass);
    validator.validate(props);
    if (validator.errors) {
      throw new RepositoryValidationError(validator.errors);
    }
    return validator.validatedData;
  }

  get items(): E[] {
    return this.props.items;
  }

  get total(): number {
    return this.props.total;
  }

  get currentPage(): number {
    return this.props.currentPage;
  }

  get lastPage(): number {
    return this.props.lastPage;
  }

  get limit(): number {
    return this.props.limit;
  }

  get sort(): "id" | EntityPropsKeys<E> | null {
    return this.props.sort;
  }

  get order(): SortOrder | null {
    return this.props.order;
  }

  get filter(): Filter | null {
    return this.props.filter;
  }

  toJSON(): Omit<SearchResultProps<E, Filter>, "items"> & {
    lastPage: number;
  } & { items: Record<string, any>[] } {
    return {
      items: this.items.map((item: E) => item.toJSON()),
      total: this.total,
      currentPage: this.currentPage,
      lastPage: this.lastPage,
      limit: this.limit,
      sort: this.sort,
      order: this.order,
      filter: this.filter,
    };
  }
}
