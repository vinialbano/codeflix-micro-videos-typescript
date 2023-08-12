import { Category, CategoryRepository } from "#category/domain";
import {
  EntityPropsKeys,
  InMemorySearchableRepository,
} from "#seedwork/domain";

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository.Repository
{
  sortableFields: Array<"id" | EntityPropsKeys<Category>> = [
    "name",
    "description",
    "createdAt",
    "isActive",
    "id",
  ];

  constructor() {
    super(Category);
  }

  protected async applyFilter(
    items: Category[],
    filter: CategoryRepository.SearchParams["filter"]
  ): Promise<Category[]> {
    if (!filter) {
      return items;
    }
    return items.filter((item) =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  protected async applySort(
    items: Category[],
    sort: CategoryRepository.SearchParams["sort"],
    order: CategoryRepository.SearchParams["order"]
  ): Promise<Category[]> {
    return sort
      ? super.applySort(items, sort, order)
      : super.applySort(items, "createdAt", "desc");
  }
}
