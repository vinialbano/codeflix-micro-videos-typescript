import { Chance } from "chance";
import { UUID } from "../../../shared/domain/value-objects/uuid.vo";
import { CategoryFakeBuilder } from "../category-fake.builder";
import { Category } from "../category.entity";

describe("CategoryFakeBuilder Unit Tests", () => {
  describe("categoryId()", () => {
    it("should throw an error if a factory is not provided", () => {
      expect(() => CategoryFakeBuilder.aCategory().categoryId).toThrow(
        new Error(
          "Property categoryId does not have a factory. Use withCategoryId() method to set a factory."
        )
      );
    });

    it("should return a UUID", () => {
      const builder = CategoryFakeBuilder.aCategory().withUUID(
        () => new UUID()
      );
      expect(builder.categoryId).toBeInstanceOf(UUID);
    });

    it("should return an ID given an index", () => {
      const builder = CategoryFakeBuilder.aCategory().withUUID(
        (i) => `${i + 1}` as any
      );
      expect(builder.categoryId).toBe("1");
    });
  });

  describe("name()", () => {
    it("should return a fixed name", () => {
      const builder = CategoryFakeBuilder.aCategory().withName("name");
      expect(builder.name).toBe("name");
    });

    it("should return a name given an index", () => {
      const builder = CategoryFakeBuilder.aCategory().withName(
        (i) => `name ${i + 1}`
      );
      expect(builder.name).toBe("name 1");
    });

    it("should return a random name if no factory is provided", () => {
      const chance = Chance();
      const chanceSpy = jest.spyOn(chance, "word");
      const builder = CategoryFakeBuilder.aCategory();
      builder["chance"] = chance;
      expect(builder.name).toBeDefined();
      expect(chanceSpy).toHaveBeenCalled();
    });
  });

  describe("description()", () => {
    it("should return a fixed description", () => {
      const builder =
        CategoryFakeBuilder.aCategory().withDescription("description");
      expect(builder.description).toBe("description");
    });

    it("should return a description given an index", () => {
      const builder = CategoryFakeBuilder.aCategory().withDescription(
        (i) => `description ${i + 1}`
      );
      expect(builder.description).toBe("description 1");
    });

    it("should return a random description if no factory is provided", () => {
      const chance = Chance();
      const chanceSpy = jest.spyOn(chance, "sentence");
      const builder = CategoryFakeBuilder.aCategory();
      builder["chance"] = chance;
      expect(builder.description).toBeDefined();
      expect(chanceSpy).toHaveBeenCalled();
    });
  });

  describe("isActive()", () => {
    it("should return a fixed isActive", () => {
      const builder = CategoryFakeBuilder.aCategory().withIsActive(false);
      expect(builder.isActive).toBe(false);
    });

    it("should return a isActive given an index", () => {
      const builder = CategoryFakeBuilder.aCategory().withIsActive(
        (i) => i % 2 === 0
      );
      expect(builder.isActive).toBe(true);
    });

    it("should return true if no factory is provided", () => {
      const builder = CategoryFakeBuilder.aCategory();
      expect(builder.isActive).toBe(true);
    });
  });

  describe("createdAt()", () => {
    it("should throw an error if a factory is not provided", () => {
      expect(() => CategoryFakeBuilder.aCategory().createdAt).toThrow(
        new Error(
          "Property createdAt does not have a factory. Use withCreatedAt() method to set a factory."
        )
      );
    });

    it("should return a Date", () => {
      const builder = CategoryFakeBuilder.aCategory().withCreatedAt(
        () => new Date()
      );
      expect(builder.createdAt).toBeInstanceOf(Date);
    });

    it("should return a Date given an index", () => {
      const builder = CategoryFakeBuilder.aCategory().withCreatedAt(
        (i) => new Date(i + 1)
      );
      expect(builder.createdAt).toEqual(new Date(1));
    });
  });

  describe("aCategory()", () => {
    it("should return a CategoryFakeBuilder", () => {
      const builder = CategoryFakeBuilder.aCategory();
      expect(builder).toBeInstanceOf(CategoryFakeBuilder);
    });
  });

  describe("someCategories()", () => {
    it("should return a CategoryFakeBuilder", () => {
      const builder = CategoryFakeBuilder.someCategories(2);
      expect(builder).toBeInstanceOf(CategoryFakeBuilder);
    });
  });

  describe("withUUID()", () => {
    it("should return a CategoryFakeBuilder", () => {
      const builder = CategoryFakeBuilder.aCategory().withUUID(
        () => new UUID()
      );
      expect(builder).toBeInstanceOf(CategoryFakeBuilder);
    });

    it("should set categoryId factory and generate a UUID", () => {
      const builder = CategoryFakeBuilder.aCategory().withUUID(
        () => new UUID()
      );
      const factory = builder["_categoryId"] as any;
      expect(factory()).toBeInstanceOf(UUID);
    });

    it("should set categoryId to a given value", () => {
      const categoryId = new UUID();
      const builder = CategoryFakeBuilder.aCategory().withUUID(categoryId);
      expect(builder["_categoryId"]).toBe(categoryId);
    });
  });

  describe("withName()", () => {
    it("should return a CategoryFakeBuilder", () => {
      const builder = CategoryFakeBuilder.aCategory().withName(() => "name");
      expect(builder).toBeInstanceOf(CategoryFakeBuilder);
    });

    it("should set name factory and generate a string", () => {
      const builder = CategoryFakeBuilder.aCategory().withName(() => "name");
      const factory = builder["_name"] as any;
      expect(factory()).toBe("name");
    });

    it("should set name to a given value", () => {
      const builder = CategoryFakeBuilder.aCategory().withName("name");
      expect(builder["_name"]).toBe("name");
    });
  });

  describe("withDescription()", () => {
    it("should return a CategoryFakeBuilder", () => {
      const builder = CategoryFakeBuilder.aCategory().withDescription(
        () => "description"
      );
      expect(builder).toBeInstanceOf(CategoryFakeBuilder);
    });

    it("should set description factory and generate a string", () => {
      const builder = CategoryFakeBuilder.aCategory().withDescription(
        () => "description"
      );
      const factory = builder["_description"] as any;
      expect(factory()).toBe("description");
    });

    it("should set description to a given value", () => {
      const builder = CategoryFakeBuilder.aCategory().withDescription(null);
      expect(builder["_description"]).toBe(null);
    });
  });

  describe("withIsActive()", () => {
    it("should return a CategoryFakeBuilder", () => {
      const builder = CategoryFakeBuilder.aCategory().withIsActive(() => true);
      expect(builder).toBeInstanceOf(CategoryFakeBuilder);
    });

    it("should set isActive factory and generate a boolean", () => {
      const builder = CategoryFakeBuilder.aCategory().withIsActive(() => true);
      const factory = builder["_isActive"] as any;
      expect(factory()).toBe(true);
    });

    it("should set isActive to a given value", () => {
      const builder = CategoryFakeBuilder.aCategory().withIsActive(false);
      expect(builder["_isActive"]).toBe(false);
    });
  });

  describe("withCreatedAt()", () => {
    it("should return a CategoryFakeBuilder", () => {
      const builder = CategoryFakeBuilder.aCategory().withCreatedAt(
        () => new Date()
      );
      expect(builder).toBeInstanceOf(CategoryFakeBuilder);
    });

    it("should set createdAt factory and generate a Date", () => {
      const builder = CategoryFakeBuilder.aCategory().withCreatedAt(
        () => new Date()
      );
      const factory = builder["_createdAt"] as any;
      expect(factory()).toBeInstanceOf(Date);
    });

    it("should set createdAt to a given value", () => {
      const date = new Date();
      const builder = CategoryFakeBuilder.aCategory().withCreatedAt(date);
      expect(builder["_createdAt"]).toBe(date);
    });
  });

  describe("withInvalidNameTooLong()", () => {
    it("should return a CategoryFakeBuilder", () => {
      const builder = CategoryFakeBuilder.aCategory().withInvalidNameTooLong();
      expect(builder).toBeInstanceOf(CategoryFakeBuilder);
    });

    it("should set name factory and generate a name with 256 characters", () => {
      const builder = CategoryFakeBuilder.aCategory().withInvalidNameTooLong();
      const factory = builder["_name"] as any;
      expect(factory()).toHaveLength(256);
    });

    it("should set name to a given a value", () => {
      const builder = CategoryFakeBuilder.aCategory().withInvalidNameTooLong(
        "a".repeat(256)
      );
      expect(builder["_name"]).toHaveLength(256);
    });
  });

  describe("active()", () => {
    it("should return a CategoryFakeBuilder", () => {
      const builder = CategoryFakeBuilder.aCategory().active();
      expect(builder).toBeInstanceOf(CategoryFakeBuilder);
    });

    it("should set isActive factory to true", () => {
      const builder = CategoryFakeBuilder.aCategory().active();
      expect(builder["_isActive"]).toBe(true);
    });
  });

  describe("inactive()", () => {
    it("should return a CategoryFakeBuilder", () => {
      const builder = CategoryFakeBuilder.aCategory().inactive();
      expect(builder).toBeInstanceOf(CategoryFakeBuilder);
    });

    it("should set isActive factory to false", () => {
      const builder = CategoryFakeBuilder.aCategory().inactive();
      expect(builder["_isActive"]).toBe(false);
    });
  });

  describe("build()", () => {
    it("should return a Category", () => {
      const category = CategoryFakeBuilder.aCategory().build();
      expect(category).toBeInstanceOf(Category);
      expect(category.categoryId).toBeInstanceOf(UUID);
      expect(category.name).toBeDefined();
      expect(category.description).toBeDefined();
      expect(category.isActive).toBeDefined();
      expect(category.createdAt).toBeDefined();
    });

    it("should return a Category with a fixed UUID", () => {
      const categoryId = new UUID();
      const category = CategoryFakeBuilder.aCategory()
        .withUUID(() => categoryId)
        .build();
      expect(category.categoryId).toBe(categoryId);
    });

    it("should return a Category with a fixed name", () => {
      const name = "name";
      const category = CategoryFakeBuilder.aCategory()
        .withName(() => name)
        .build();
      expect(category.name).toBe(name);
    });

    it("should return a Category with a fixed description", () => {
      const description = "description";
      const category = CategoryFakeBuilder.aCategory()
        .withDescription(() => description)
        .build();
      expect(category.description).toBe(description);
    });

    it("should return a Category with a fixed isActive", () => {
      const isActive = false;
      const category = CategoryFakeBuilder.aCategory()
        .withIsActive(() => isActive)
        .build();
      expect(category.isActive).toBe(isActive);
    });

    it("should return a Category with a fixed createdAt", () => {
      const createdAt = new Date();
      const category = CategoryFakeBuilder.aCategory()
        .withCreatedAt(() => createdAt)
        .build();
      expect(category.createdAt).toBe(createdAt);
    });

    it("should return many Categories", () => {
      const categories = CategoryFakeBuilder.someCategories(2).build();
      expect(categories).toBeInstanceOf(Array);
      expect(categories.length).toBe(2);
      expect(categories[0]).toBeInstanceOf(Category);
      expect(categories[1]).toBeInstanceOf(Category);
    });
  });
});
