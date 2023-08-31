import { UpdateCategoryUseCase } from '@codeflix/micro-videos/category/application';

export class UpdateCategoryDto
  implements Omit<UpdateCategoryUseCase.Input, 'id'>
{
  name!: string;
  description?: string | null;
  isActive?: boolean;
}
