import { Entity } from "../../domain/entity";
import { SearchableRepository } from "../../domain/repository/repository";
import { SearchParams } from "../../domain/repository/search-params";
import { SearchResult } from "../../domain/repository/search-result";
import { ValueObject } from "../../domain/value-objects/value-object";
import { InMemoryRepository } from "./in-memory.repository";

export abstract class InMemorySearchableRepository<
    E extends Entity,
    EntityId extends ValueObject,
    Filter = string
  >
  extends InMemoryRepository<E, EntityId>
  implements SearchableRepository<E, EntityId, Filter>
{
  sortableFields: string[] = [];

  async search(props: SearchParams<Filter>): Promise<SearchResult<E>> {
    const filteredItems = await this.applyFilter(this.items, props.filter);
    const sortedItems = this.applySort(
      filteredItems,
      props.sort,
      props.sortDirection
    );
    const paginatedItems = this.applyPagination(
      sortedItems,
      props.page,
      props.limit
    );

    return new SearchResult<E>({
      items: paginatedItems,
      total: filteredItems.length,
      currentPage: props.page,
      limit: props.limit,
    });
  }

  protected abstract applyFilter(
    items: E[],
    filter: Filter | null
  ): Promise<E[]>;

  protected applyPagination(
    items: E[],
    page: SearchParams["page"],
    limit: SearchParams["limit"]
  ): E[] {
    const start = (page - 1) * limit;
    const end = start + limit;
    return items.slice(start, end);
  }

  protected applySort(
    items: E[],
    sort: SearchParams["sort"],
    sortDirection: SearchParams["sortDirection"],
    customGetter?: (sort: string, item: E) => any
  ): E[] {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }
    return [...items].sort((a, b) => {
      const aValue = customGetter ? customGetter(sort, a) : a[sort as keyof E];
      const bValue = customGetter ? customGetter(sort, b) : b[sort as keyof E];
      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }
}
