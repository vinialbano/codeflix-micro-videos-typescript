import { Entity } from "../entities/entity";
import { NotFoundError } from "../errors/not-found.error";
import { UniqueEntityID } from "../value-objects/unique-entity-id.vo";
import { Repository, SearchableRepository } from "./repository.interface";
import { SearchParams } from "./search-params";
import { SearchResult } from "./search-result";

export abstract class InMemoryRepository<E extends Entity<any>>
  implements Repository<E>
{
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async findById(id: string | UniqueEntityID): Promise<E> {
    return this._get(id);
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  async update(entity: E): Promise<void> {
    await this._get(entity.id);
    const index = this.items.findIndex((item) => item.id === entity.id);
    this.items[index] = entity;
  }

  async delete(id: string | UniqueEntityID): Promise<void> {
    await this._get(id);
    const index = this.items.findIndex((item) => item.id === id);
    this.items.splice(index, 1);
  }

  protected async _get(id: string | UniqueEntityID): Promise<E> {
    const _id = `${id}`;
    const item = this.items.find((item) => item.id === _id);
    if (!item) {
      throw new NotFoundError(`Entity not found using ID ${_id}`);
    }
    return item;
  }
}

export abstract class InMemorySearchableRepository<
    E extends Entity<any>,
    Filter = string
  >
  extends InMemoryRepository<E>
  implements SearchableRepository<E, Filter>
{
  abstract sortableFields: Array<"id" | keyof E["props"]>;

  constructor(protected readonly entityClass: new (...args: any[]) => E) {
    super();
  }

  async search(
    props: SearchParams<E, Filter>
  ): Promise<SearchResult<E, Filter>> {
    const itemsFiltered = await this.applyFilter(this.items, props.filter);
    const itemsSorted = await this.applySort(
      itemsFiltered,
      props.sort,
      props.order
    );
    const itemsPaginated = await this.applyPagination(
      itemsSorted,
      props.page,
      props.limit
    );
    return new SearchResult<E, Filter>(
      {
        items: itemsPaginated,
        total: itemsFiltered.length,
        currentPage: props.page,
        limit: props.limit,
        sort: props.sort,
        order: props.order,
        filter: props.filter,
      },
      this.entityClass
    );
  }

  protected abstract applyFilter(
    items: E[],
    filter: SearchParams<E, Filter>["filter"]
  ): Promise<E[]>;

  protected async applySort(
    items: E[],
    sort: SearchParams<E, Filter>["sort"],
    order: SearchParams<E, Filter>["order"]
  ): Promise<E[]> {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }

    return [...items].sort((a: any, b: any) => {
      if (a.props[sort] < b.props[sort]) {
        return order === "asc" ? -1 : 1;
      }

      if (a.props[sort] > b.props[sort]) {
        return order === "asc" ? 1 : -1;
      }

      return 0;
    });
  }

  protected async applyPagination(
    items: E[],
    page: SearchParams<E, Filter>["page"],
    limit: SearchParams<E, Filter>["limit"]
  ): Promise<E[]> {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    return items.slice(startIndex, endIndex);
  }
}
