import { UpdateCategoryUseCase } from '#category/application';
import { CategoryTestBuilder } from '#category/domain/entitites/category.test-builder';
import { CategoryModel, CategorySequelizeRepository } from '#category/infra';
import { NotFoundError } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/tests';

const makeSut = () => {
  const categoryRepository = new CategorySequelizeRepository(CategoryModel);
  const sut = new UpdateCategoryUseCase.UseCase(categoryRepository);
  return { sut, categoryRepository };
};
describe('UpdateCategoryUseCase Integration Tests', () => {
  setupSequelize({ models: [CategoryModel] });
  describe('execute()', () => {
    it('should throw an error if category is not found', async () => {
      const { sut } = makeSut();
      const promise = sut.execute({
        id: 'unexisting_id',
        name: 'name',
        description: 'description',
        isActive: true,
      });
      await expect(promise).rejects.toThrowError(
        new NotFoundError('Entity not found using ID unexisting_id'),
      );
    });

    it('should update and persist the category', async () => {
      const { sut, categoryRepository } = makeSut();
      const category = CategoryTestBuilder.aCategory().build();
      await categoryRepository.insert(category);
      const arrange = [
        {
          given: { name: 'New name 1' },
          expected: { name: 'New name 1', description: null, isActive: true },
        },
        {
          given: { name: 'New name 2', description: 'New description' },
          expected: {
            name: 'New name 2',
            description: 'New description',
            isActive: true,
          },
        },
        {
          given: { name: 'New name 3', description: null },
          expected: { name: 'New name 3', description: null, isActive: true },
        },
        {
          given: { name: 'New name 4', isActive: false },
          expected: { name: 'New name 4', description: null, isActive: false },
        },
        {
          given: { name: 'New name 5', isActive: true },
          expected: { name: 'New name 5', description: null, isActive: true },
        },
        {
          given: {
            name: 'New name 6',
            description: 'New description 6',
            isActive: true,
          },
          expected: {
            name: 'New name 6',
            description: 'New description 6',
            isActive: true,
          },
        },
      ];
      for (const { given, expected } of arrange) {
        const result = await sut.execute({
          id: category.id,
          ...given,
        });
        expect(result).toStrictEqual({
          id: category.id,
          name: expected.name,
          description: expected.description,
          isActive: expected.isActive,
          createdAt: category.createdAt,
        });
        const updatedCategory = await categoryRepository.findById(category.id);
        expect(updatedCategory.name).toBe(expected.name);
        expect(updatedCategory.description).toBe(expected.description);
        expect(updatedCategory.isActive).toBe(expected.isActive);
      }
    });
  });
});
