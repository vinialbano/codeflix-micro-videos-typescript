import { ListCategoriesUseCase } from '#category/application';
import {
  CategoryModel,
  CategoryModelMapper,
  CategorySequelizeRepository,
} from '#category/infra';
import { CategoryModelFactory } from '#category/infra/db/sequelize/category-model.factory';
import { setupSequelize } from '#seedwork/infra';
import { Chance } from 'chance';

const makeSut = () => {
  const categoryRepository = new CategorySequelizeRepository(CategoryModel);
  const sut = new ListCategoriesUseCase.UseCase(categoryRepository);
  return { sut, categoryRepository };
};
describe('ListCategoriesUseCase Unit Tests', () => {
  setupSequelize({ models: [CategoryModel] });
  describe('execute()', () => {
    it('should list all categories sorted by createdAt by default', async () => {
      const { sut } = makeSut();
      const entities = (
        await CategoryModelFactory()
          .count(2)
          .bulkCreate((i) => ({
            id: Chance().guid({ version: 4 }),
            name: `Category ${i}`,
            description: `Description ${i}`,
            isActive: Chance().bool(),
            createdAt: new Date(new Date().getTime() + i * 1000),
          }))
      )
        .map(CategoryModelMapper.toEntity)
        .map((e) => e.toJSON());
      const result = await sut.execute({});
      expect(result).toStrictEqual({
        items: [entities[1], entities[0]],
        total: 2,
        currentPage: 1,
        lastPage: 1,
        limit: 15,
      });
    });

    it('should list categories usint pagination, sort, and filter', async () => {
      const { sut } = makeSut();
      const entities = (
        await CategoryModelFactory()
          .count(9)
          .bulkCreate((i) => ({
            id: Chance().guid({ version: 4 }),
            name: `Category ${i % 2 === 0 ? 'a' : 'b'} ${i}`,
            description: `Description ${i}`,
            isActive: Chance().bool(),
            createdAt: new Date(new Date().getTime() + i * 1000),
          }))
      )
        .map(CategoryModelMapper.toEntity)
        .map((e) => e.toJSON());
      const arrange: any[] = [
        {
          input: { page: 1, limit: 3 },
          output: {
            items: [...entities].reverse().slice(0, 3),
            total: 9,
            currentPage: 1,
            lastPage: 3,
            limit: 3,
          },
        },
        {
          input: { page: 2, limit: 3 },
          output: {
            items: [...entities].reverse().slice(3, 6),
            total: 9,
            currentPage: 2,
            lastPage: 3,
            limit: 3,
          },
        },
        {
          input: { sort: 'name', order: 'asc', limit: 4 },
          output: {
            items: [entities[0], entities[2], entities[4], entities[6]],
            total: 9,
            currentPage: 1,
            lastPage: 3,
            limit: 4,
          },
        },
        {
          input: { sort: 'name', order: 'desc', limit: 3, page: 2 },
          output: {
            items: [entities[1], entities[8], entities[6]],
            total: 9,
            currentPage: 2,
            lastPage: 3,
            limit: 3,
          },
        },
        {
          input: { filter: ' a ', limit: 3 },
          output: {
            items: [entities[8], entities[6], entities[4]],
            total: 5,
            currentPage: 1,
            lastPage: 2,
            limit: 3,
          },
        },
        {
          input: {
            filter: ' b ',
            limit: 3,
            page: 2,
            sort: 'name',
            order: 'asc',
          },
          output: {
            items: [entities[7]],
            total: 4,
            currentPage: 2,
            lastPage: 2,
            limit: 3,
          },
        },
      ];
      for (const i of arrange) {
        const result = await sut.execute(i.input);
        expect(result).toStrictEqual(i.output);
      }
    });
  });
});
