import { GetCategoryUseCase } from '#category/application';
import { CategoryModel, CategorySequelizeRepository } from '#category/infra';
import { CategoryModelFactory } from '#category/infra/db/sequelize/category-model.factory';
import { NotFoundError } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/infra';

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
      const { sut } = makeSut();
      const model = await CategoryModelFactory().create();
      const result = await sut.execute({ id: model.id });
      expect(result).toStrictEqual({
        id: model.id,
        name: model.name,
        description: model.description,
        isActive: model.isActive,
        createdAt: model.createdAt,
      });
    });
  });
});
