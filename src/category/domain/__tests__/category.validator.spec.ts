import { UUID } from "../../../shared/domain/value-objects/uuid.vo";
import { Category, CategoryConstructorProps } from "../category.entity";
import { CategoryValidator } from "../category.validator";

describe("CategoryValidator", () => {
  describe("validate()", () => {
    const invalidCategories = [
      {
        given: {
          name: null,
          description: null,
          isActive: true,
          createdAt: new Date(),
          categoryId: new UUID(),
        },
        expected: {
          name: [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        },
      },
      {
        given: {
          name: undefined,
          description: null,
          isActive: true,
          createdAt: new Date(),
          categoryId: new UUID(),
        },
        expected: {
          name: [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        },
      },
      {
        given: {
          name: 1,
          description: null,
          isActive: true,
          createdAt: new Date(),
          categoryId: new UUID(),
        },
        expected: {
          name: [
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        },
      },
      {
        given: {
          name: "",
          description: null,
          isActive: true,
          createdAt: new Date(),
          categoryId: new UUID(),
        },
        expected: { name: ["name should not be empty"] },
      },
      {
        given: {
          name: "a".repeat(256),
          description: null,
          isActive: true,
          createdAt: new Date(),
          categoryId: new UUID(),
        },
        expected: {
          name: ["name must be shorter than or equal to 255 characters"],
        },
      },
      {
        given: {
          name: "Movie",
          description: undefined,
          isActive: true,
          createdAt: new Date(),
          categoryId: new UUID(),
        },
        expected: {
          description: ["description must be a string"],
        },
      },
      {
        given: {
          name: "Movie",
          description: 1,
          isActive: true,
          createdAt: new Date(),
          categoryId: new UUID(),
        },
        expected: {
          description: ["description must be a string"],
        },
      },
      {
        given: {
          name: "Movie",
          description: null,
          isActive: null,
          createdAt: new Date(),
          categoryId: new UUID(),
        },
        expected: {
          isActive: ["isActive must be a boolean value"],
        },
      },
      {
        given: {
          name: "Movie",
          description: null,
          isActive: false,
          createdAt: null,
          categoryId: new UUID(),
        },
        expected: {
          createdAt: ["createdAt must be a Date instance"],
        },
      },
      {
        given: {
          name: "Movie",
          description: null,
          isActive: false,
          createdAt: new Date(),
          categoryId: null,
        },
        expected: {
          categoryId: ["categoryId must be an instance of UUID"],
        },
      },
    ];
    it.each(invalidCategories)(
      "should include errors for invalid fields with $given",
      ({ given, expected }) => {
        const categoryValidator = new CategoryValidator();
        const isValid = categoryValidator.validate(given as Category);
        expect(isValid).toBe(false);
        expect(categoryValidator.errors).toEqual(expected);
      }
    );
  });

  const validCategories = [
    {
      name: "Movie",
      description: null,
      isActive: true,
      createdAt: new Date(),
      categoryId: new UUID(),
    },
    {
      name: "Movie",
      description: "A movie",
      isActive: true,
      createdAt: new Date(),
      categoryId: new UUID(),
    },
    {
      name: "Movie",
      description: "A movie",
      isActive: false,
      createdAt: new Date(),
      categoryId: new UUID(),
    },
  ];

  it.each(validCategories)(
    "should not include errors with $category",
    (category) => {
      const categoryValidator = new CategoryValidator();
      const isValid = categoryValidator.validate(category as Category);
      expect(isValid).toBe(true);
      expect(categoryValidator.errors).toBeNull();
    }
  );
});
