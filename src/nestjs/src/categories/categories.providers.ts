import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@codeflix/micro-videos/category/application';
import { CategoryRepository } from '@codeflix/micro-videos/category/domain';
import { CategoryInMemoryRepository } from '@codeflix/micro-videos/category/infra';

export namespace CATEGORIES_PROVIDERS {
  export namespace REPOSITORIES {
    export const CATEGORY_IN_MEMORY = {
      provide: 'CategoryInMemoryRepository',
      useClass: CategoryInMemoryRepository,
    };
  }

  export namespace USE_CASES {
    export const CREATE_CATEGORY = {
      provide: CreateCategoryUseCase.UseCase,
      useFactory: (categoryRepository: CategoryRepository.Repository) => {
        return new CreateCategoryUseCase.UseCase(categoryRepository);
      },
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY.provide],
    };
    export const UPDATE_CATEGORY = {
      provide: UpdateCategoryUseCase.UseCase,
      useFactory: (categoryRepository: CategoryRepository.Repository) => {
        return new UpdateCategoryUseCase.UseCase(categoryRepository);
      },
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY.provide],
    };
    export const DELETE_CATEGORY = {
      provide: DeleteCategoryUseCase.UseCase,
      useFactory: (categoryRepository: CategoryRepository.Repository) => {
        return new DeleteCategoryUseCase.UseCase(categoryRepository);
      },
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY.provide],
    };
    export const GET_CATEGORY = {
      provide: GetCategoryUseCase.UseCase,
      useFactory: (categoryRepository: CategoryRepository.Repository) => {
        return new GetCategoryUseCase.UseCase(categoryRepository);
      },
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY.provide],
    };
    export const LIST_CATEGORIES = {
      provide: ListCategoriesUseCase.UseCase,
      useFactory: (categoryRepository: CategoryRepository.Repository) => {
        return new ListCategoriesUseCase.UseCase(categoryRepository);
      },
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY.provide],
    };
  }
}
