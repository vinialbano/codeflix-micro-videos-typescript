import { ListCategoriesUseCase } from '@codeflix/micro-videos/category/application';

export class SearchCategoryDto implements ListCategoriesUseCase.Input {
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
  filter?: string;
}
