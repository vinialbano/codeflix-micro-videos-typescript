import { CreateCategoryUseCase } from '#category/application';
import { CategoryModel, CategorySequelizeRepository } from '#category/infra';
import { setupSequelize } from '#seedwork/infra';

const makeSut = () => {
  const categoryRepository = new CategorySequelizeRepository(CategoryModel);
  const sut = new CreateCategoryUseCase.UseCase(categoryRepository);
  return { sut, categoryRepository };
};
describe('CreateCategoryUseCase Integration Tests', () => {
  setupSequelize({ models: [CategoryModel] });

  describe('execute()', () => {
    describe('should create and persist a new category', () => {
      const arrange = [
        { name: 'Category 1' },
        {
          name: 'Category 2',
          description: 'Description 2',
        },
        {
          name: 'Category 3',
          description: null,
        },
        {
          name: 'Category 4',
          isActive: true,
        },
        {
          name: 'Category 4',
          isActive: false,
        },
        {
          name: 'Category 5',
          description: 'Description 5',
          isActive: true,
        },
        {
          name: 'Category 6',
          description: 'Description 6',
          isActive: false,
        },
        {
          name: 'Category 7',
          description: null,
          isActive: true,
        },
        {
          name: 'Category 8',
          description: null,
          isActive: false,
        },
      ];
      it.each(arrange)('when input is %p', async (input) => {
        const { sut, categoryRepository } = makeSut();

        const result = await sut.execute(input);
        const category = await categoryRepository.findById(result.id);
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
});
