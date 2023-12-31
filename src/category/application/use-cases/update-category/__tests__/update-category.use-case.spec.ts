import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { EntityValidationError } from "../../../../../shared/domain/errors/validation.error";
import {
  InvalidUUIDError,
  UUID,
} from "../../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../../domain/category.entity";
import { CategoryRepository } from "../../../../domain/category.repository";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository";
import { UpdateCategoryUseCase } from "../update-category.use-case";

describe("UpdateCategoryUseCase Unit Tests", () => {
  let useCase: UpdateCategoryUseCase;
  let categoryRepository: CategoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository();
    useCase = new UpdateCategoryUseCase(categoryRepository);
  });

  describe("execute()", () => {
    it("should throw an error if uuid is invalid", async () => {
      const input = { id: "invalid-uuid" };
      await expect(useCase.execute(input)).rejects.toThrow(
        new InvalidUUIDError(input.id)
      );
    });

    it("should throw an error if category does not exist", async () => {
      const input = { id: new UUID().id };
      await expect(useCase.execute(input)).rejects.toThrow(
        new NotFoundError(input.id, Category)
      );
    });

    it("should throw if the entity is invalid", async () => {
      const uuid = new UUID();
      const input = {
        id: uuid.id,
        name: "a".repeat(256),
      };
      const category = Category.fake().aCategory().withUUID(uuid).build();
      await categoryRepository.insert(category);
      await expect(() => useCase.execute(input)).rejects.toThrow(
        EntityValidationError
      );
    });

    const assertions = [
      {
        given: { name: "Category 1" },
        expected: { name: "Category 1" },
      },
      {
        given: { description: "Description 2" },
        expected: { description: "Description 2" },
      },
      {
        given: { isActive: false },
        expected: { isActive: false },
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
      "should update an existing category",
      async ({ given, expected }) => {
        const category = Category.fake().aCategory().build();
        await categoryRepository.insert(category);
        const updateSpy = jest.spyOn(categoryRepository, "update");
        const output = await useCase.execute({
          id: category.categoryId.id,
          ...given,
        });
        expect(updateSpy).toHaveBeenCalledTimes(1);
        expect(output).toStrictEqual({
          id: category.categoryId.id,
          name: expected.name ?? category.name,
          description: expected.description ?? category.description,
          isActive: expected.isActive ?? category.isActive,
          createdAt: category.createdAt,
        });
      }
    );
  });
});
