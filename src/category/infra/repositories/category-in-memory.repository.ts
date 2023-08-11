import { EntityPropsKeys } from "../../../@seedwork/domain/entities/entity";
import { InMemorySearchableRepository } from "../../../@seedwork/domain/repositories/in-memory.repository";
import { Category } from "../../domain/entitites/category";
import { CategoryRepository } from "../../domain/repositories/category.repository";

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
