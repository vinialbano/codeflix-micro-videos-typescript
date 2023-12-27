import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { InvalidUUIDError } from "../../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../../domain/category.entity";
import { CategoryRepository } from "../../../../domain/category.repository";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository";
import { GetCategoryUseCase } from "../../get-category.use-case";

describe("GetCategoryUseCase Unit Tests", () => {
  let useCase: GetCategoryUseCase;
  let categoryRepository: CategoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository();
    useCase = new GetCategoryUseCase(categoryRepository);
  });

  describe("execute()", () => {
    it("should throw an error if uuid is invalid", async () => {
      const input = { id: "invalid-uuid" };
      await expect(useCase.execute(input)).rejects.toThrow(
        new InvalidUUIDError(input.id)
      );
    });

    it("should throw an error if category does not exist", async () => {
      const input = { id: "f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e" };
      await expect(useCase.execute(input)).rejects.toThrow(
        new NotFoundError(input.id, Category)
      );
    });

    it("should return an existing category", async () => {
      const category = Category.fake().aCategory().build();
      await categoryRepository.insert(category);
      const findByIdSpy = jest.spyOn(categoryRepository, "findById");
      const output = await useCase.execute({
        id: category.categoryId.id,
      });
      expect(findByIdSpy).toHaveBeenCalledTimes(1);
      expect(output).toStrictEqual({
        id: category.categoryId.id,
        name: category.name,
        description: category.description,
        isActive: category.isActive,
        createdAt: category.createdAt,
      });
    });
  });
});
