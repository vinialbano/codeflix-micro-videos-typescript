import { Entity } from '../entity';
import { ValueObject } from '../value-objects/value-object';

export type SortDirection = 'asc' | 'desc';

export type SortCriterion<E> = {
  field: Extract<keyof E, string>;
  direction?: SortDirection;
  transform?: (prop: any) => any;
};

export type SearchParamsConstructorProps<E extends Entity, Filter = string> = {
  page?: number;
  limit?: number;
  sortCriteria?: SortCriterion<E> | SortCriterion<E>[] | null;
  filter?: Filter | null;
};

export function normalizeCriterion<E extends Entity>(
  criterion: SortCriterion<E>,
): SortCriterion<E> | null {
  // Nullify the criterion if it is not an object
  if (!criterion || typeof criterion !== 'object') {
    return null;
  }

  let { direction, transform } = criterion;
  // Nullify the criterion if field is not a string
  if (typeof criterion.field !== 'string') {
    return null;
  }

  // Convert direction to lowercase and default to 'asc' if not 'asc' or 'desc'
  if (!direction || typeof direction !== 'string') {
    direction = 'asc';
  }
  direction = direction.toLowerCase() as SortDirection;
  direction = ['asc', 'desc'].includes(direction) ? direction : 'asc';

  // Unset transform if it is not a function
  if (transform && typeof transform !== 'function') {
    transform = undefined;
  }

  // Return the criterion
  return {
    field: criterion.field,
    direction,
    ...(transform && { transform }),
  };
}

export class SearchParams<
  E extends Entity,
  Filter = string,
> extends ValueObject {
  protected _page: number = 1;
  protected _limit: number = 15;
  protected _sortCriteria: SortCriterion<E> | SortCriterion<E>[] | null = null;
  protected _filter: Filter | null = null;

  constructor(props: SearchParamsConstructorProps<E, Filter> = {}) {
    super();
    this.page = props.page;
    this.limit = props.limit!;
    this.sortCriteria = props.sortCriteria!;
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

  get sortCriteria(): SortCriterion<E> | SortCriterion<E>[] | null {
    return this._sortCriteria;
  }

  private set sortCriteria(
    sortCriteria: SortCriterion<E> | SortCriterion<E>[] | null,
  ) {
    // Reset to null if no valid criteria are provided
    if (!sortCriteria) {
      this._sortCriteria = null;
      return;
    }

    // Ensuring that sortCriteria is always an array
    const criteriaArray = Array.isArray(sortCriteria)
      ? sortCriteria
      : [sortCriteria];

    // Filtering and verifying each criterion
    const normalizedCriteria = criteriaArray
      .map(normalizeCriterion)
      .filter((criterion) => criterion !== null) as SortCriterion<E>[];

    // Adjusting _sortCriteria based on the verified criteria
    if (!normalizedCriteria.length) {
      this._sortCriteria = null;
      return;
    }
    if (normalizedCriteria.length === 1) {
      this._sortCriteria = normalizedCriteria[0]!;
      return;
    }
    this._sortCriteria = normalizedCriteria;
  }

  get filter(): Filter | null {
    return this._filter;
  }

  private set filter(filter: Filter | null) {
    this._filter =
      filter === null || filter === undefined || (filter as unknown) === ''
        ? null
        : (`${filter}` as Filter);
  }

  protected validate(): void {}
}
