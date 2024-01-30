import { InvalidUUIDError } from '../../../../../shared/domain/value-objects/uuid.vo';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CategoryRepository } from '../../../../domain/category.repository';
import { CategorySequelizeRepository } from '../../../../infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../infra/db/sequelize/category.model';
import { DeleteCategoryUseCase } from '../delete-category.use-case';
import { Category, CategoryId } from '../../../../domain/category.aggregate';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';

describe('DeleteCategoryUseCase Integration Tests', () => {
  let useCase: DeleteCategoryUseCase;
  let categoryRepository: CategoryRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase(categoryRepository);
  });

  describe('execute()', () => {
    it('should throw an error if uuid is invalid', async () => {
      const input = { id: 'invalid-uuid' };
      await expect(useCase.execute(input)).rejects.toThrow(
        new InvalidUUIDError(input.id),
      );
    });

    it('should throw an error if category does not exist', async () => {
      const input = { id: new CategoryId().id };
      await expect(useCase.execute(input)).rejects.toThrow(
        new NotFoundError(input.id, Category),
      );
    });

    it('should delete an existing category', async () => {
      const category = Category.fake().aCategory().build();
      await categoryRepository.insert(category);
      await useCase.execute({
        id: category.categoryId.id,
      });
      const entity = await categoryRepository.findById(category.categoryId);
      expect(entity).toBeNull();
    });
  });
});
