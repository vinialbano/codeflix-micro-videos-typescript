import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CategoryRepository } from '../../../../domain/category.repository';
import { CategorySequelizeRepository } from '../../../../infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../infra/db/sequelize/category.model';
import { UpdateCategoryUseCase } from '../update-category.use-case';
import { Category, CategoryId } from '../../../../domain/category.aggregate';

describe('UpdateCategoryUseCase Integration Tests', () => {
  let useCase: UpdateCategoryUseCase;
  let categoryRepository: CategoryRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    useCase = new UpdateCategoryUseCase(categoryRepository);
  });

  describe('execute()', () => {
    const inputs = [
      { name: 'Category 1' },
      { name: 'Category 2', description: 'Description 2' },
      {
        name: 'Category 3',
        isActive: false,
      },
      { name: 'Category 4', description: 'Description 4', isActive: true },
    ];
    it.each(inputs)('should update an existing category', async (input) => {
      const category = Category.fake().aCategory().build();
      await categoryRepository.insert(category);
      const output = await useCase.execute({
        id: category.categoryId.id,
        ...input,
      });
      const entity = await categoryRepository.findById(
        new CategoryId(output.id),
      );
      expect(output).toStrictEqual({
        id: entity!.categoryId.id,
        name: input.name ?? entity!.name,
        description: input.description ?? entity!.description,
        isActive: input.isActive ?? entity!.isActive,
        createdAt: entity!.createdAt,
      });
    });
  });
});
