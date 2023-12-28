import { EntityValidationError } from "../../../../../shared/domain/errors/validation.error";
import { CategoryRepository } from "../../../../domain/category.repository";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository";
import { CreateCategoryUseCase } from "../create-category.use-case";

describe("CreateCategoryUseCase Unit Tests", () => {
  let useCase: CreateCategoryUseCase;
  let categoryRepository: CategoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUseCase(categoryRepository);
  });

  describe("execute()", () => {
    it("should throw if the entity is invalid", async () => {
      const input = {
        name: "a".repeat(256),
      };
      await expect(() => useCase.execute(input)).rejects.toThrow(
        EntityValidationError
      );
    });

    const assertions = [
      {
        given: { name: "Category 1" },
        expected: { name: "Category 1", description: null, isActive: true },
      },
      {
        given: { name: "Category 2", description: "Description 2" },
        expected: {
          name: "Category 2",
          description: "Description 2",
          isActive: true,
        },
      },
      {
        given: {
          name: "Category 3",
          isActive: false,
        },
        expected: {
          name: "Category 3",
          description: null,
          isActive: false,
        },
      },
      {
        given: {
          name: "Category 4",
          description: "Description 4",
          isActive: true,
        },
        expected: {
          name: "Category 4",
          description: "Description 4",
          isActive: true,
        },
      },
    ];
    it.each(assertions)(
      "should create a category",
      async ({ given, expected }) => {
        const insertSpy = jest.spyOn(categoryRepository, "insert");
        const output = await useCase.execute(given);

        expect(insertSpy).toHaveBeenCalledTimes(1);
        expect(output).toEqual({
          id: expect.any(String),
          name: expected.name,
          description: expected.description,
          isActive: expected.isActive,
          createdAt: expect.any(Date),
        });
      }
    );
  });
});
