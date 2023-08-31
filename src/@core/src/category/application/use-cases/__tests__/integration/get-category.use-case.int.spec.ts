import { GetCategoryUseCase } from '#category/application';
import { CategoryTestBuilder } from '#category/domain/entitites/category.test-builder';
import { CategoryModel, CategorySequelizeRepository } from '#category/infra';
import { NotFoundError } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/tests';

const makeSut = () => {
  const categoryRepository = new CategorySequelizeRepository(CategoryModel);
  const sut = new GetCategoryUseCase.UseCase(categoryRepository);
  return { sut, categoryRepository };
};
describe('GetCategoryUseCase Integration Tests', () => {
  setupSequelize({ models: [CategoryModel] });
  describe('execute()', () => {
    it('should throw an error if category is not found', async () => {
      const { sut } = makeSut();
      const promise = sut.execute({ id: 'unexisting_id' });
      await expect(promise).rejects.toThrowError(
        new NotFoundError('Entity not found using ID unexisting_id'),
      );
    });

    it('should retrieve an existing category', async () => {
      const { sut, categoryRepository } = makeSut();
      const category = CategoryTestBuilder.aCategory().build();
      await categoryRepository.insert(category);
      const result = await sut.execute({ id: category.id });
      expect(result).toStrictEqual({
        id: category.id,
        name: category.name,
        description: category.description,
        isActive: category.isActive,
        createdAt: category.createdAt,
      });
    });
  });
});
