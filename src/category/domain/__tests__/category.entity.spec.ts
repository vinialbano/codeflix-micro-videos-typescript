import { EntityValidationError } from "../../../shared/domain/errors/validation.error";
import { UUID } from "../../../shared/domain/value-objects/uuid.vo";
import { CategoryFakeBuilder } from "../category-fake.builder";
import { Category } from "../category.entity";
import { CategoryValidator } from "../category.validator";

describe("Category Unit Tests", () => {
  describe("constructor()", () => {
    const assertions = [
      {
        given: { name: "Movie" },
        expected: {
          categoryId: expect.any(UUID),
          name: "Movie",
          description: null,
          isActive: true,
          createdAt: expect.any(Date),
        },
      },
      {
        given: { name: "Movie", description: "Movie category" },
        expected: {
          categoryId: expect.any(UUID),
          name: "Movie",
          description: "Movie category",
          isActive: true,
          createdAt: expect.any(Date),
        },
      },
      {
        given: { name: "Movie", description: null },
        expected: {
          categoryId: expect.any(UUID),
          name: "Movie",
          description: null,
          isActive: true,
          createdAt: expect.any(Date),
        },
      },
      {
        given: { name: "Movie", isActive: false },
        expected: {
          categoryId: expect.any(UUID),
          name: "Movie",
          description: null,
          isActive: false,
          createdAt: expect.any(Date),
        },
      },
      {
        given: {
          name: "Movie",
          createdAt: new Date("2021-01-01T00:00:00.000Z"),
        },
        expected: {
          categoryId: expect.any(UUID),
          name: "Movie",
          description: null,
          isActive: true,
          createdAt: new Date("2021-01-01T00:00:00.000Z"),
        },
      },
      {
        given: {
          categoryId: new UUID("f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e"),
          name: "Movie",
          description: "Movie category",
          isActive: true,
          createdAt: new Date("2021-01-01T00:00:00.000Z"),
        },
        expected: {
          categoryId: new UUID("f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e"),
          name: "Movie",
          description: "Movie category",
          isActive: true,
          createdAt: new Date("2021-01-01T00:00:00.000Z"),
        },
      },
    ];
    it.each(assertions)(
      "should create a new category with default values given $given",
      ({ given, expected }) => {
        const category = new Category(given);

        expect(category).toBeDefined();
        expect(category.categoryId).toBeInstanceOf(UUID);
        expect(category.categoryId).toEqual(expected.categoryId);
        expect(category.name).toBe(expected.name);
        expect(category.description).toBe(expected.description);
        expect(category.isActive).toBe(expected.isActive);
        expect(category.createdAt).toBeInstanceOf(Date);
        expect(category.createdAt).toEqual(expected.createdAt);
      }
    );
  });

  describe("create()", () => {
    const validProps = [
      {
        given: { name: "Movie" },
        expected: {
          categoryId: expect.any(UUID),
          name: "Movie",
          description: null,
          isActive: true,
        },
      },
      {
        given: { name: "Movie", description: "Movie category" },
        expected: {
          categoryId: expect.any(UUID),
          name: "Movie",
          description: "Movie category",
          isActive: true,
        },
      },
      {
        given: { name: "Movie", description: null },
        expected: {
          categoryId: expect.any(UUID),
          name: "Movie",
          description: null,
          isActive: true,
        },
      },
      {
        given: { name: "Movie", isActive: false },
        expected: {
          categoryId: expect.any(UUID),
          name: "Movie",
          description: null,
          isActive: false,
        },
      },
      {
        given: {
          categoryId: new UUID("f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e"),
          name: "Movie",
          description: "Movie category",
          isActive: true,
        },
        expected: {
          categoryId: new UUID("f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e"),
          name: "Movie",
          description: "Movie category",
          isActive: true,
        },
      },
    ];
    it.each(validProps)(
      "should create a new category with $given",
      ({ given, expected }) => {
        const category = Category.create(given);

        expect(category).toBeDefined();
        expect(category).toBeInstanceOf(Category);
        expect(category.categoryId).toBeInstanceOf(UUID);
        expect(category.categoryId).toEqual(expected.categoryId);
        expect(category.name).toBe(expected.name);
        expect(category.description).toBe(expected.description);
        expect(category.isActive).toBe(expected.isActive);
        expect(category.createdAt).toBeInstanceOf(Date);
      }
    );

    const invalidProps = [
      {
        given: { name: null },
        expected: {
          name: [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        },
      },
      {
        given: { name: 1 },
        expected: {
          name: [
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        },
      },
      {
        given: { name: "" },
        expected: {
          name: ["name should not be empty"],
        },
      },
      {
        given: { name: "a".repeat(256) },
        expected: {
          name: ["name must be shorter than or equal to 255 characters"],
        },
      },
      {
        given: {
          name: "Movie",
          categoryId: 1,
        },
        expected: {
          categoryId: ["categoryId must be an instance of UUID"],
        },
      },
      {
        given: {
          name: "Movie",
          description: 1,
        },
        expected: {
          description: ["description must be a string"],
        },
      },
      {
        given: {
          name: "Movie",
          isActive: 1,
        },
        expected: {
          isActive: ["isActive must be a boolean value"],
        },
      },
    ];
    it.each(invalidProps)(
      "should throw an error with $given",
      ({ given, expected }) => {
        const createCategory = () => Category.create(given as any);
        expect(createCategory).toThrow(EntityValidationError);
        expect(createCategory).toThrowWithErrorFields(expected);
      }
    );
  });

  describe("validate()", () => {
    it("should call the validator with the category", () => {
      const validateSpy = jest
        .spyOn(CategoryValidator.prototype, "validate")
        .mockReturnValue(true);
      const category = new Category({ name: "Movie" });
      Category.validate(category);
      expect(validateSpy).toHaveBeenCalledWith(category);
      validateSpy.mockRestore();
    });

    it("should throw an error if the category is invalid", () => {
      const validateSpy = jest
        .spyOn(CategoryValidator.prototype, "validate")
        .mockReturnValue(false);
      const category = new Category({ name: "Movie" });
      expect(() => Category.validate(category)).toThrow(EntityValidationError);
      validateSpy.mockRestore();
    });
  });

  describe("entityId()", () => {
    it("should return the category id", () => {
      const category = Category.create({ name: "Movie" });
      expect(category.entityId).toBe(category.categoryId);
    });
  });

  describe("changeName()", () => {
    const validNames = [
      {
        given: "Documentary",
        expected: "Documentary",
      },
      {
        given: "TV Show",
        expected: "TV Show",
      },
    ];
    it.each(validNames)(
      "should change the name of the category to $given",
      ({ given, expected }) => {
        const category = Category.create({ name: "Movie" });
        category.changeName(given);
        expect(category.name).toBe(expected);
      }
    );

    const invalidNames = [
      {
        given: null,
        expected: {
          name: [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        },
      },
      {
        given: 1,
        expected: {
          name: [
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        },
      },
      {
        given: "",
        expected: {
          name: ["name should not be empty"],
        },
      },
      {
        given: "a".repeat(256),
        expected: {
          name: ["name must be shorter than or equal to 255 characters"],
        },
      },
    ];
    it.each(invalidNames)(
      "should throw an error with $given",
      ({ given, expected }) => {
        const category = Category.create({ name: "Movie" });
        const changeName = () => category.changeName(given as any);
        expect(changeName).toThrow(EntityValidationError);
        expect(changeName).toThrowWithErrorFields(expected);
      }
    );
  });

  describe("changeDescription()", () => {
    const validDescriptions = [
      {
        given: "Documentary description",
        expected: "Documentary description",
      },
      {
        given: "TV Show description",
        expected: "TV Show description",
      },
      {
        given: null,
        expected: null,
      },
    ];
    it.each(validDescriptions)(
      "should change the description of the category to $given",
      ({ given, expected }) => {
        const category = Category.create({ name: "Movie" });
        category.changeDescription(given);
        expect(category.description).toBe(expected);
      }
    );

    const invalidDescriptions = [
      {
        given: 1,
        expected: {
          description: ["description must be a string"],
        },
      },
    ];
    it.each(invalidDescriptions)(
      "should throw an error with $given",
      async ({ given, expected }) => {
        const category = Category.create({ name: "Movie" });
        const changeDescription = () =>
          category.changeDescription(given as any);
        expect(changeDescription).toThrow(EntityValidationError);
        expect(changeDescription).toThrowWithErrorFields(expected);
      }
    );
  });

  describe("activate()", () => {
    it("should activate the category", () => {
      const category = Category.create({ name: "Movie", isActive: false });
      category.activate();
      expect(category.isActive).toBe(true);
    });
  });

  describe("deactivate()", () => {
    it("should deactivate the category", () => {
      const category = Category.create({ name: "Movie", isActive: true });
      category.deactivate();
      expect(category.isActive).toBe(false);
    });
  });

  describe("toJSON()", () => {
    it("should return a plain object representation of the category", () => {
      const category = Category.create({
        name: "Movie",
        description: "Movie category",
        isActive: true,
      });
      expect(category.toJSON()).toEqual({
        categoryId: category.categoryId.id,
        name: "Movie",
        description: "Movie category",
        isActive: true,
        createdAt: category.createdAt,
      });
    });
  });

  describe("fake()", () => {
    it("should return a FakeCategoryBuilder", () => {
      const fakeCategoryBuilder = Category.fake();
      expect(fakeCategoryBuilder).toBeDefined();
      expect(fakeCategoryBuilder.aCategory).toBeDefined();
      expect(fakeCategoryBuilder.someCategories).toBeDefined();
    });
  });
});
