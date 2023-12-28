import { Entity } from "../entity";
import { ValueObject } from "../value-objects/value-object";

type SearchResultProps<E extends Entity> = {
  items: E[];
  total: number;
  currentPage: number;
  limit: number;
};

export class SearchResult<E extends Entity = Entity> extends ValueObject {
  readonly items: E[];
  readonly total: number;
  readonly currentPage: number;
  readonly limit: number;

  constructor(props: SearchResultProps<E>) {
    super();
    this.items = props.items;
    this.total = props.total;
    this.currentPage = props.currentPage;
    this.limit = props.limit;
  }

  get lastPage(): number {
    return this.total > 0 ? Math.ceil(this.total / this.limit) : 1;
  }

  toJSON(forceEntity = false) {
    return {
      items: forceEntity ? this.items.map((item) => item.toJSON()) : this.items,
      total: this.total,
      currentPage: this.currentPage,
      limit: this.limit,
      lastPage: this.lastPage,
    };
  }
}
