import { ValueObject } from "../value-objects/value-object";

export type SortDirection = "asc" | "desc";

export type SearchParamsConstructorProps<Filter = string> = {
  page?: number;
  limit?: number;
  sort?: string | null;
  sortDirection?: SortDirection | null;
  filter?: Filter | null;
};

export class SearchParams<Filter = string> extends ValueObject {
  protected _page: number = 1;
  protected _limit: number = 15;
  protected _sort: string | null = null;
  protected _sortDirection: SortDirection | null = null;
  protected _filter: Filter | null = null;

  constructor(props: SearchParamsConstructorProps<Filter> = {}) {
    super();
    this.page = props.page;
    this.limit = props.limit!;
    this.sort = props.sort!;
    this.sortDirection = props.sortDirection!;
    this.filter = props.filter!;
    this.validate();
  }

  get page(): number {
    return this._page;
  }

  private set page(page: number | undefined) {
    let _page = Number(page);
    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1;
    }
    this._page = _page;
  }

  get limit(): number {
    return this._limit;
  }

  private set limit(limit: number) {
    let _limit = limit === (true as any) ? this._limit : +limit;
    if (
      Number.isNaN(_limit) ||
      _limit <= 0 ||
      parseInt(_limit as any) !== _limit
    ) {
      _limit = this._limit;
    }
    this._limit = _limit;
  }

  get sort(): string | null {
    return this._sort;
  }

  private set sort(sort: string | null) {
    this._sort =
      sort === null || sort === undefined || sort === "" ? null : `${sort}`;
  }

  get sortDirection(): SortDirection | null {
    return this._sortDirection;
  }

  private set sortDirection(sortDirection: SortDirection | null) {
    if (!this.sort) {
      this._sortDirection = null;
      return;
    }
    const direction = `${sortDirection}`.toLowerCase() as SortDirection;
    this._sortDirection =
      direction !== "asc" && direction !== "desc" ? "asc" : direction;
  }

  get filter(): Filter | null {
    return this._filter;
  }

  private set filter(filter: Filter | null) {
    this._filter =
      filter === null || filter === undefined || (filter as unknown) === ""
        ? null
        : (`${filter}` as Filter);
  }

  protected validate(): void {}
}
