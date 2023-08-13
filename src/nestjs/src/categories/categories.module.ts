import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CATEGORIES_PROVIDERS } from './categories.providers';
import { CategoriesService } from './categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    ...Object.values(CATEGORIES_PROVIDERS.REPOSITORIES),
    ...Object.values(CATEGORIES_PROVIDERS.USE_CASES),
  ],
})
export class CategoriesModule {}
