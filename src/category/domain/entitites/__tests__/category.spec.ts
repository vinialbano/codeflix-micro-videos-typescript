import { UniqueEntityID } from "../../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import { Category, CategoryProperties } from "../category";
describe("Category Tests", () => {
  beforeEach(() => {
    Category.validate = jest.fn();
  });
  describe("Constructor of Category", () => {
    it("should validate the properties", () => {
      const props: CategoryProperties = {
        name: "Movie",
        description: "A story in a sequence of images and sounds.",
        isActive: true,
        createdAt: new Date(),
      };
      expect(() => new Category(props)).not.toThrow();
      expect(Category.validate).toHaveBeenCalledTimes(1);
      expect(Category.validate).toHaveBeenCalledWith(props);
    });

    it("should throw if the properties are invalid", () => {
      const props = {} as CategoryProperties;
      (Category.validate as jest.Mock).mockImplementationOnce(() => {
        throw new Error("Invalid properties");
      });
      expect(() => new Category(props)).toThrow();
      expect(Category.validate).toHaveBeenCalledTimes(1);
      expect(Category.validate).toHaveBeenCalledWith(props);
    });

    it.each<CategoryProperties>([
      {
        name: "Movie",
        description: "A story in a sequence of images and sounds.",
        isActive: true,
        createdAt: new Date(),
      },
      {
        name: "Series",
        description: "A series of movies.",
        isActive: false,
        createdAt: new Date(),
      },
    ])("should create a category with all the properties", (props) => {
      const category = new Category(props);
      expect(category).toBeDefined();
      expect(category.name).toBe(props.name);
      expect(category.description).toBe(props.description);
      expect(category.isActive).toBe(props.isActive);
      expect(category.createdAt).toBe(props.createdAt);
    });

    it("should create a category without the description property", () => {
      const props: CategoryProperties = {
        name: "Movie",
        isActive: false,
        createdAt: new Date(),
      };
      const category = new Category(props);
      expect(category.name).toBe(props.name);
      expect(category.isActive).toBe(props.isActive);
      expect(category.createdAt).toBe(props.createdAt);
      expect(category.description).toBeNull();
    });

    it("should create an active category without the isActive property", () => {
      const props: CategoryProperties = {
        name: "Movie",
        createdAt: new Date(),
      };
      const category = new Category(props);
      expect(category.name).toBe(props.name);
      expect(category.createdAt).toBe(props.createdAt);
      expect(category.isActive).toBe(true);
    });

    it("should create a category with the current date without the createdAt property", () => {
      const props: CategoryProperties = {
        name: "Movie",
      };
      const category = new Category(props);
      expect(category.name).toBe(props.name);
      expect(category.createdAt).toBeInstanceOf(Date);
    });

    it.each([new UniqueEntityID(), null, undefined])(
      "should have a valid id",
      (id) => {
        const props: CategoryProperties = {
          name: "Movie",
        };
        const category = new Category(props, id);
        expect(category.id).toBeDefined();
        expect(category.id).not.toBeNull();
      }
    );
  });

  describe("Category getters", () => {
    it.each(["name", "description", "isActive", "createdAt"])(
      "should return the %s property",
      (property) => {
        const props: CategoryProperties = {
          name: "Movie",
          description: "A story in a sequence of images and sounds.",
          isActive: true,
          createdAt: new Date(),
        };
        const category = new Category(props);
        // @ts-ignore
        expect(category[property]).toBe(props[property]);
      }
    );
  });

  describe("update()", () => {
    it("should validate the properties", () => {
      const props: CategoryProperties = {
        name: "Movie",
        description: "A story in a sequence of images and sounds.",
        isActive: true,
        createdAt: new Date(),
      };
      const category = new Category(props);
      const newName = "Series";
      const newDescription = "A series of movies.";
      category.update(newName, newDescription);
      expect(Category.validate).toHaveBeenCalledTimes(2);
      expect(Category.validate).toHaveBeenNthCalledWith(2, {
        name: newName,
        description: newDescription,
      });
    });

    it("should throw if the properties are invalid", () => {
      const props: CategoryProperties = {
        name: "Movie",
        description: "A story in a sequence of images and sounds.",
        isActive: true,
        createdAt: new Date(),
      };
      const category = new Category(props);
      const newName = "Series";
      const newDescription = "A series of movies.";
      (Category.validate as jest.Mock).mockImplementationOnce(() => {
        throw new Error("Invalid properties");
      });
      expect(() => category.update(newName, newDescription)).toThrow();
      expect(Category.validate).toHaveBeenCalledTimes(2);
      expect(Category.validate).toHaveBeenNthCalledWith(2, {
        name: newName,
        description: newDescription,
      });
    });

    it("should update the name and description", () => {
      const props: CategoryProperties = {
        name: "Movie",
        description: "A story in a sequence of images and sounds.",
        isActive: true,
        createdAt: new Date(),
      };
      const category = new Category(props);
      const newName = "Series";
      const newDescription = "A series of movies.";
      category.update(newName, newDescription);
      expect(category.name).toBe(newName);
      expect(category.description).toBe(newDescription);
      category.update(newName, null);
      expect(category.name).toBe(newName);
      expect(category.description).toBeNull();
      category.update(newName, undefined);
      expect(category.name).toBe(newName);
      expect(category.description).toBeNull();
    });
  });

  describe("activate()", () => {
    it("should activate the category", () => {
      const props: CategoryProperties = {
        name: "Movie",
        description: "A story in a sequence of images and sounds.",
        isActive: false,
        createdAt: new Date(),
      };
      const category = new Category(props);
      category.activate();
      expect(category.isActive).toBe(true);
    });
  });

  describe("deactivate()", () => {
    it("should deactivate the category", () => {
      const props: CategoryProperties = {
        name: "Movie",
        description: "A story in a sequence of images and sounds.",
        isActive: true,
        createdAt: new Date(),
      };
      const category = new Category(props);
      category.deactivate();
      expect(category.isActive).toBe(false);
    });
  });
});
