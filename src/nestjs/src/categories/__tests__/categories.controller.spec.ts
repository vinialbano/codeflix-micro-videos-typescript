import {
  CreateCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@codeflix/micro-videos/category/application';
import { CategoriesController } from '../categories.controller';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { SearchCategoryDto } from '../dto/search-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryCollectionPresenter } from '../presenter/category-collection.presenter';
import { CategoryPresenter } from '../presenter/category.presenter';

describe('CategoriesController Unit Tests', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should create a category', async () => {
    const output: CreateCategoryUseCase.Output = {
      id: '123a456b-890c-432a-b101-c234d567e890',
      name: 'Category 1',
      description: 'Category 1 description',
      isActive: true,
      createdAt: new Date(),
    };
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue(output),
    };
    // @ts-expect-error - Mocking the use case
    controller['createUseCase'] = mockUseCase;
    const input: CreateCategoryDto = {
      name: 'Category 1',
      description: 'Category 1 description',
      isActive: true,
    };
    const presenter = await controller.create(input);
    expect(mockUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
  });

  it('should update a category', async () => {
    const id = '123a456b-890c-432a-b101-c234d567e890';
    const output: UpdateCategoryUseCase.Output = {
      id,
      name: 'Category 1',
      description: 'Category 1 description',
      isActive: true,
      createdAt: new Date(),
    };
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue(output),
    };
    // @ts-expect-error - Mocking the use case
    controller['updateUseCase'] = mockUseCase;
    const input: UpdateCategoryDto = {
      name: 'Category 1',
      description: 'Category 1 description',
      isActive: true,
    };
    const presenter = await controller.update(id, input);
    expect(mockUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
  });

  it('should delete a category', async () => {
    const id = '123a456b-890c-432a-b101-c234d567e890';
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue(undefined),
    };
    // @ts-expect-error - Mocking the use case
    controller['deleteUseCase'] = mockUseCase;
    expect(controller.remove(id)).toBeInstanceOf(Promise);
    const output = await controller.remove(id);
    expect(mockUseCase.execute).toHaveBeenCalledWith({ id });
    expect(output).toBeUndefined();
  });

  it('should get a category', async () => {
    const id = '123a456b-890c-432a-b101-c234d567e890';
    const output: GetCategoryUseCase.Output = {
      id,
      name: 'Category 1',
      description: 'Category 1 description',
      isActive: true,
      createdAt: new Date(),
    };
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue(output),
    };
    // @ts-expect-error - Mocking the use case
    controller['getUseCase'] = mockUseCase;
    const presenter = await controller.findOne(id);
    expect(mockUseCase.execute).toHaveBeenCalledWith({ id });
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
  });

  it('should list categories', async () => {
    const output: ListCategoriesUseCase.Output = {
      items: [
        {
          id: '123a456b-890c-432a-b101-c234d567e890',
          name: 'Category 1',
          description: 'Category 1 description',
          isActive: true,
          createdAt: new Date(),
        },
      ],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      limit: 2,
    };
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue(output),
    };
    // @ts-expect-error - Mocking the use case
    controller['listUseCase'] = mockUseCase;
    const input: SearchCategoryDto = {
      page: 1,
      limit: 2,
      sort: 'name',
      order: 'asc',
      filter: 'Category 1',
    };
    const presenter = await controller.search(input);
    expect(mockUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CategoryCollectionPresenter);
    expect(presenter).toStrictEqual(new CategoryCollectionPresenter(output));
  });
});
