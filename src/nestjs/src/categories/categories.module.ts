import { CategoryModel } from '@codeflix/micro-videos/category/infra';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriesController } from './categories.controller';
import { CATEGORIES_PROVIDERS } from './categories.providers';

@Module({
  imports: [SequelizeModule.forFeature([CategoryModel])],
  controllers: [CategoriesController],
  providers: [
    ...Object.values(CATEGORIES_PROVIDERS.REPOSITORIES),
    ...Object.values(CATEGORIES_PROVIDERS.USE_CASES),
  ],
})
export class CategoriesModule {}
