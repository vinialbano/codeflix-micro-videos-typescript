import { SortDirection } from "../../../../../shared/domain/repository/search-params";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { Category } from "../../../../domain/category.entity";
import { CategoryRepository } from "../../../../domain/category.repository";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { ListCategoriesUseCase } from "../list-categories.use-case";
import { CategoryOutputMapper } from "../../shared/category-output";

describe("ListCategoriesUseCase Integration Tests", () => {
  let useCase: ListCategoriesUseCase;
  let categoryRepository: CategoryRepository;
  const categories = Category.fake()
    .someCategories(5)
    .withName((i) => `Category ${i % 2 === 0 ? "A" : "B"}${i}`)
    .withCreatedAt((i) => new Date(new Date().getTime() + i * 1000))
    .build();

  setupSequelize({ models: [CategoryModel] });

  beforeEach(async () => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    useCase = new ListCategoriesUseCase(categoryRepository);
    await categoryRepository.insertMany(categories);
  });

  describe("execute()", () => {
    const assertions = [
      {
        given: {},
        expected: {
          items: [...categories]
            .reverse()
            .map((c) => CategoryOutputMapper.toDTO(c)),
          total: 5,
          currentPage: 1,
          lastPage: 1,
          limit: 15,
        },
      },
      {
        given: {
          page: 2,
          limit: 2,
        },
        expected: {
          items: [categories[2], categories[1]].map((c) =>
            CategoryOutputMapper.toDTO(c!)
          ),
          total: 5,
          currentPage: 2,
          lastPage: 3,
          limit: 2,
        },
      },
      {
        given: {
          sort: "name",
          sortDirection: "desc" as SortDirection,
        },
        expected: {
          items: [
            categories[3],
            categories[1],
            categories[4],
            categories[2],
            categories[0],
          ].map((c) => CategoryOutputMapper.toDTO(c!)),
          total: 5,
          currentPage: 1,
          lastPage: 1,
          limit: 15,
        },
      },
      {
        given: {
          filter: "B",
        },
        expected: {
          items: [categories[3], categories[1]].map((c) =>
            CategoryOutputMapper.toDTO(c!)
          ),
          total: 2,
          currentPage: 1,
          lastPage: 1,
          limit: 15,
        },
      },
    ];
    it.each(assertions)(
      "should return a list of categories",
      async ({ given, expected }) => {
        const output = await useCase.execute(given);
        expect(output).toStrictEqual(expected);
      }
    );
  });
});
