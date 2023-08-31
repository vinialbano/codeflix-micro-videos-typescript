import { ListCategoriesUseCase } from '@codeflix/micro-videos/category/application';

export class SearchCategoryDto implements ListCategoriesUseCase.Input {
  page?: number;
  limit?: number;
  sort?: 'name' | 'isActive' | 'createdAt' | null;
  order?: 'asc' | 'desc' | null;
  filter?: string;
}
