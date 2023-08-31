import { UpdateCategoryUseCase } from '#category/application';
import { Category } from '#category/domain';
import { CategoryInMemoryRepository } from '#category/infra';
import { NotFoundError } from '#seedwork/domain';

const makeSut = () => {
  const categoryRepository = new CategoryInMemoryRepository();
  const sut = new UpdateCategoryUseCase.UseCase(categoryRepository);
  return { sut, categoryRepository };
};
describe('UpdateCategoryUseCase Unit Tests', () => {
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
      const spyUpdate = jest.spyOn(categoryRepository, 'update');
      const category = new Category({ name: 'Old name' });
      categoryRepository.items = [category];
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
        expect(category.name).toBe(expected.name);
        expect(category.description).toBe(expected.description);
        expect(category.isActive).toBe(expected.isActive);
      }
      expect(spyUpdate).toBeCalledTimes(6);
    });
  });
});
