import { SortCriterion } from '@core/shared/domain/repository/search-params';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory-searchable.repository';
import { Category, CategoryId } from '../../../domain/category.aggregate';
import {
  CategoryFilter,
  CategoryRepository,
} from '../../../domain/category.repository';

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category, CategoryId>
  implements CategoryRepository
{
  sortableFields: string[] = ['name', 'createdAt'];

  getEntity() {
    return Category;
  }

  protected async applyFilter(
    items: Category[],
    filter: CategoryFilter | null,
  ): Promise<Category[]> {
    if (!filter) {
      return items;
    }
    return items.filter((item) =>
      item.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  protected applySort(
    items: Category[],
    sortCriteria?: SortCriterion<Category> | SortCriterion<Category>[] | null,
  ): Category[] {
    return sortCriteria
      ? super.applySort(items, sortCriteria)
      : super.applySort(items, {
          field: 'createdAt',
          direction: 'desc',
        });
  }
}
