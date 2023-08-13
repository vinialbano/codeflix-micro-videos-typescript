import {
  CreateCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@codeflix/micro-videos/category/application';
import { CategoriesController } from './categories.controller';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SearchCategoryDto } from './dto/search-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesController Unit Tests', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should create a category', async () => {
    const expectedOutput: CreateCategoryUseCase.Output = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Category 1',
      description: 'Category 1 description',
      isActive: true,
      createdAt: new Date(),
    };
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue(expectedOutput),
    };
    // @ts-expect-error - Mocking the use case
    controller['createUseCase'] = mockUseCase;
    const input: CreateCategoryDto = {
      name: 'Category 1',
      description: 'Category 1 description',
      isActive: true,
    };
    const output = await controller.create(input);
    expect(mockUseCase.execute).toHaveBeenCalledWith(input);
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should update a category', async () => {
    const id = '123e4567-e89b-12d3-a456-426614174000';
    const expectedOutput: UpdateCategoryUseCase.Output = {
      id,
      name: 'Category 1',
      description: 'Category 1 description',
      isActive: true,
      createdAt: new Date(),
    };
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue(expectedOutput),
    };
    // @ts-expect-error - Mocking the use case
    controller['updateUseCase'] = mockUseCase;
    const input: UpdateCategoryDto = {
      name: 'Category 1',
      description: 'Category 1 description',
      isActive: true,
    };
    const output = await controller.update(id, input);
    expect(mockUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should delete a category', async () => {
    const id = '123e4567-e89b-12d3-a456-426614174000';
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
    const id = '123e4567-e89b-12d3-a456-426614174000';
    const expectedOutput: GetCategoryUseCase.Output = {
      id,
      name: 'Category 1',
      description: 'Category 1 description',
      isActive: true,
      createdAt: new Date(),
    };
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue(expectedOutput),
    };
    // @ts-expect-error - Mocking the use case
    controller['getUseCase'] = mockUseCase;
    const output = await controller.findOne(id);
    expect(mockUseCase.execute).toHaveBeenCalledWith({ id });
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should list categories', async () => {
    const expectedOutput: ListCategoriesUseCase.Output = {
      items: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
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
      execute: jest.fn().mockResolvedValue(expectedOutput),
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
    const output = await controller.search(input);
    expect(mockUseCase.execute).toHaveBeenCalledWith(input);
    expect(output).toStrictEqual(expectedOutput);
  });
});
