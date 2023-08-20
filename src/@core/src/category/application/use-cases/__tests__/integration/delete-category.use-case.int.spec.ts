import { DeleteCategoryUseCase } from '#category/application';
import { CategoryModel, CategorySequelizeRepository } from '#category/infra';
import { CategoryModelFactory } from '#category/infra/db/sequelize/category-model.factory';
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
      const { sut } = makeSut();
      const model = await CategoryModelFactory().create();
      const result = await sut.execute({ id: model.id });
      expect(result).toBeUndefined();
      const foundModel = await CategoryModel.findByPk(model.id);
      expect(foundModel).toBeNull();
    });
  });
});
