import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CategoryRepository } from '../../../../domain/category.repository';
import { CategorySequelizeRepository } from '../../../../infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../infra/db/sequelize/category.model';
import { GetCategoryUseCase } from '../get-category.use-case';
import { Category } from '../../../../domain/category.aggregate';

describe('GetCategoryUseCase Integration Tests', () => {
  let useCase: GetCategoryUseCase;
  let categoryRepository: CategoryRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    useCase = new GetCategoryUseCase(categoryRepository);
  });

  describe('execute()', () => {
    it('should return an existing category', async () => {
      const category = Category.fake().aCategory().build();
      await categoryRepository.insert(category);
      const output = await useCase.execute({
        id: category.categoryId.id,
      });
      expect(output).toStrictEqual({
        id: category.categoryId.id,
        name: category.name,
        description: category.description,
        isActive: category.isActive,
        createdAt: category.createdAt,
      });
    });
  });
});
