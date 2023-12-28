import exp from "constants";
import { UUID } from "../../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { CategoryRepository } from "../../../../domain/category.repository";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import {
  CreateCategoryInput,
  CreateCategoryUseCase,
} from "../create-category.use-case";

describe("CreateCategoryUseCase Integration Tests", () => {
  let useCase: CreateCategoryUseCase;
  let categoryRepository: CategoryRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    useCase = new CreateCategoryUseCase(categoryRepository);
  });

  describe("execute()", () => {
    const inputs = [
      { name: "Category 1" },
      { name: "Category 2", description: "Description 2" },
      {
        name: "Category 3",
        isActive: false,
      },
      { name: "Category 4", description: "Description 4", isActive: true },
    ];
    it.each(inputs)("should create a category", async (input) => {
      const output = await useCase.execute(input);
      const entity = await categoryRepository.findById(new UUID(output.id));
      expect(output).toStrictEqual({
        id: entity!.categoryId.id,
        name: entity!.name,
        description: entity!.description,
        isActive: entity!.isActive,
        createdAt: entity!.createdAt,
      });
    });
  });
});
