import { CreateCategoryUseCase } from '@codeflix/micro-videos/category/application';

export class CreateCategoryDto implements CreateCategoryUseCase.Input {
  name!: string;
  description?: string | null;
  isActive?: boolean;
}
