import { CategoriesController } from '../categories.controller';
import { CreateCategoryOutput } from '@core/category/application/use-cases/create-category/create-category.use-case';
import { CreateCategoryDto } from '../dto/create-category.dto';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from '../categories.presenter';
import { UpdateCategoryInput } from '@core/category/application/use-cases/update-category/update-category.input';
import { ListCategoriesOutput } from '@core/category/application/use-cases/list-categories/list-categories.use-case';
import { GetCategoryOutput } from '@core/category/application/use-cases/get-category/get-category.use-case';
import { SortDirection } from '@core/shared/domain/repository/search-params';

// // Reference
// beforeEach(async () => {
//   const module: TestingModule = await Test.createTestingModule({
//     imports: [ConfigModule.forRoot(), CategoriesModule],
//   })
//     .overrideProvider(getModelToken(CategoryModel))
//     .useValue({})
//     .overrideProvider('CategoryRepository')
//     .useValue(CategoryInMemoryRepository)
//     .compile();

//   controller = module.get<CategoriesController>(CategoriesController);
// });

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(() => {
    controller = new CategoriesController();
  });
  describe('create()', () => {
    it('should create a category', async () => {
      const output: CreateCategoryOutput = {
        id: 'f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e',
        name: 'Category 1',
        description: 'Description 1',
        isActive: true,
        createdAt: new Date(),
      };
      const mockCreateUseCase = {
        execute: jest.fn().mockResolvedValue(output),
      };
      // @ts-expect-error define partial mock
      controller['createUseCase'] = mockCreateUseCase;
      const input: CreateCategoryDto = {
        name: 'Category 1',
        description: 'Description 1',
        isActive: true,
      };
      const presenter = await controller.create(input);
      expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
      expect(presenter).toBeInstanceOf(CategoryPresenter);
      expect(presenter).toStrictEqual(new CategoryPresenter(output));
    });
  });

  describe('update()', () => {
    it('should update a category', async () => {
      const id = 'f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e';
      const output: CreateCategoryOutput = {
        id,
        name: 'Category 1',
        description: 'Description 1',
        isActive: true,
        createdAt: new Date(),
      };
      const mockUpdateUseCase = {
        execute: jest.fn().mockResolvedValue(output),
      };
      // @ts-expect-error define partial mock
      controller['updateUseCase'] = mockUpdateUseCase;
      const input: Omit<UpdateCategoryInput, 'id'> = {
        name: 'Category 1',
        description: 'Description 1',
        isActive: true,
      };
      const presenter = await controller.update(id, input);
      expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
      expect(presenter).toBeInstanceOf(CategoryPresenter);
      expect(presenter).toStrictEqual(new CategoryPresenter(output));
    });
  });

  describe('remove()', () => {
    it('should delete a category', async () => {
      const id = 'f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e';
      const mockDeleteUseCase = {
        execute: jest.fn().mockResolvedValue(undefined),
      };
      // @ts-expect-error define partial mock
      controller['deleteUseCase'] = mockDeleteUseCase;
      await controller.remove(id);
      expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    });
  });

  describe('findOne()', () => {
    it('should get a category', async () => {
      const id = 'f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e';
      const output: GetCategoryOutput = {
        id,
        name: 'Category 1',
        description: 'Description 1',
        isActive: true,
        createdAt: new Date(),
      };
      const mockGetUseCase = {
        execute: jest.fn().mockResolvedValue(output),
      };
      // @ts-expect-error define partial mock
      controller['getUseCase'] = mockGetUseCase;
      const presenter = await controller.findOne(id);
      expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
      expect(presenter).toBeInstanceOf(CategoryPresenter);
      expect(presenter).toStrictEqual(new CategoryPresenter(output));
    });
  });

  describe('search()', () => {
    it('should list categories', async () => {
      const output: ListCategoriesOutput = {
        items: [
          {
            id: 'f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e',
            name: 'Category 1',
            description: 'Description 1',
            isActive: true,
            createdAt: new Date(),
          },
        ],
        currentPage: 1,
        limit: 10,
        lastPage: 1,
        total: 1,
      };
      const mockListUseCase = {
        execute: jest.fn().mockResolvedValue(output),
      };
      // @ts-expect-error define partial mock
      controller['listUseCase'] = mockListUseCase;
      const searchParams = {
        page: 1,
        limit: 2,
        offset: 1,
        sort: 'name',
        sortDirection: 'desc' as SortDirection,
        filter: 'test',
      };
      const presenter = await controller.search(searchParams);
      expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
      expect(presenter).toBeInstanceOf(CategoryCollectionPresenter);
      expect(presenter).toStrictEqual(new CategoryCollectionPresenter(output));
    });
  });
});
