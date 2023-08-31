import { DeleteCategoryUseCase } from '#category/application';
import { CategoryTestBuilder } from '#category/domain/entitites/category.test-builder';
import { CategoryModel, CategorySequelizeRepository } from '#category/infra';
import { NotFoundError } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/tests';

const makeSut = () => {
  const categoryRepository = new CategorySequelizeRepository(CategoryModel);
  const sut = new DeleteCategoryUseCase.UseCase(categoryRepository);
  return { sut, categoryRepository };
};
describe('DeleteCategoryUseCase Integration Tests', () => {
  setupSequelize({ models: [CategoryModel] });

  describe('execute()', () => {
    it('should throw an error if category is not found', async () => {
      const { sut } = makeSut();
      const promise = sut.execute({ id: 'unexisting_id' });
      await expect(promise).rejects.toThrowError(
        new NotFoundError('Entity not found using ID unexisting_id'),
      );
    });

    it('should delete an existing category', async () => {
      const { sut, categoryRepository } = makeSut();
      const category = CategoryTestBuilder.aCategory().build();
      await categoryRepository.insert(category);
      const result = await sut.execute({ id: category.id });
      expect(result).toBeUndefined();
      await expect(
        categoryRepository.findById(category.id),
      ).rejects.toThrowError(
        new NotFoundError(`Entity not found using ID ${category.id}`),
      );
    });
  });
});
