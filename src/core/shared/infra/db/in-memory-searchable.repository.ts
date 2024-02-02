import { Entity } from '../../domain/entity';
import { SearchableRepository } from '../../domain/repository/repository';
import {
  SearchParams,
  SortCriterion,
  normalizeCriterion,
} from '../../domain/repository/search-params';
import { SearchResult } from '../../domain/repository/search-result';
import { ValueObject } from '../../domain/value-objects/value-object';
import { InMemoryRepository } from './in-memory.repository';

export abstract class InMemorySearchableRepository<
    E extends Entity,
    EntityId extends ValueObject,
    Filter = string,
  >
  extends InMemoryRepository<E, EntityId>
  implements SearchableRepository<E, EntityId, Filter>
{
  sortableFields: string[] = [];

  async search(props: SearchParams<E, Filter>): Promise<SearchResult<E>> {
    const filteredItems = await this.applyFilter(this.items, props.filter);
    const sortedItems = this.applySort(filteredItems, props.sortCriteria);
    const paginatedItems = this.applyPagination(
      sortedItems,
      props.page,
      props.limit,
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
    filter: Filter | null,
  ): Promise<E[]>;

  protected applyPagination(
    items: E[],
    page: SearchParams<E>['page'],
    limit: SearchParams<E>['limit'],
  ): E[] {
    const start = (page - 1) * limit;
    const end = start + limit;
    return items.slice(start, end);
  }

  protected applySort(
    items: E[],
    criteria: SortCriterion<E> | SortCriterion<E>[] = [],
  ): E[] {
    if (!Array.isArray(criteria)) {
      criteria = [criteria];
    }
    criteria = criteria
      .map(normalizeCriterion)
      .filter((criterion) => criterion !== null) as SortCriterion<E>[];

    if (!criteria.length) {
      return items;
    }

    const compareFunctions = criteria.map(({ field, direction }) => {
      return (a: E, b: E) => {
        if (!this.sortableFields.includes(field)) {
          return 0;
        }
        const aValue = a[field];
        const bValue = b[field];
        if (aValue < bValue) {
          return direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      };
    });

    const combinedCompareFunction = (a: E, b: E): number => {
      return compareFunctions.reduce((result, compareFunction) => {
        return result === 0 ? compareFunction(a, b) : result;
      }, 0);
    };

    return [...items].sort(combinedCompareFunction);
  }
}
