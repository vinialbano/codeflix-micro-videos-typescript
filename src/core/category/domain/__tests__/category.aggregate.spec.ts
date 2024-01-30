import { Category, CategoryId } from '../category.aggregate';
import { CategoryValidator } from '../category.validator';

describe('Category Unit Tests', () => {
  describe('constructor()', () => {
    const assertions = [
      {
        given: { name: 'Movie' },
        expected: {
          categoryId: expect.any(CategoryId),
          name: 'Movie',
          description: null,
          isActive: true,
          createdAt: expect.any(Date),
        },
      },
      {
        given: { name: 'Movie', description: 'Movie category' },
        expected: {
          categoryId: expect.any(CategoryId),
          name: 'Movie',
          description: 'Movie category',
          isActive: true,
          createdAt: expect.any(Date),
        },
      },
      {
        given: { name: 'Movie', description: null },
        expected: {
          categoryId: expect.any(CategoryId),
          name: 'Movie',
          description: null,
          isActive: true,
          createdAt: expect.any(Date),
        },
      },
      {
        given: { name: 'Movie', isActive: false },
        expected: {
          categoryId: expect.any(CategoryId),
          name: 'Movie',
          description: null,
          isActive: false,
          createdAt: expect.any(Date),
        },
      },
      {
        given: {
          name: 'Movie',
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
        },
        expected: {
          categoryId: expect.any(CategoryId),
          name: 'Movie',
          description: null,
          isActive: true,
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
        },
      },
      {
        given: {
          categoryId: new CategoryId('f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e'),
          name: 'Movie',
          description: 'Movie category',
          isActive: true,
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
        },
        expected: {
          categoryId: new CategoryId('f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e'),
          name: 'Movie',
          description: 'Movie category',
          isActive: true,
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
        },
      },
    ];
    it.each(assertions)(
      'should create a new category with default values given $given',
      ({ given, expected }) => {
        const category = new Category(given);

        expect(category).toBeDefined();
        expect(category.categoryId).toBeInstanceOf(CategoryId);
        expect(category.categoryId).toEqual(expected.categoryId);
        expect(category.name).toBe(expected.name);
        expect(category.description).toBe(expected.description);
        expect(category.isActive).toBe(expected.isActive);
        expect(category.createdAt).toBeInstanceOf(Date);
        expect(category.createdAt).toEqual(expected.createdAt);
      },
    );
  });

  describe('create()', () => {
    const validProps = [
      {
        given: { name: 'Movie' },
        expected: {
          categoryId: expect.any(CategoryId),
          name: 'Movie',
          description: null,
          isActive: true,
        },
      },
      {
        given: { name: 'Movie', description: 'Movie category' },
        expected: {
          categoryId: expect.any(CategoryId),
          name: 'Movie',
          description: 'Movie category',
          isActive: true,
        },
      },
      {
        given: { name: 'Movie', description: null },
        expected: {
          categoryId: expect.any(CategoryId),
          name: 'Movie',
          description: null,
          isActive: true,
        },
      },
      {
        given: { name: 'Movie', isActive: false },
        expected: {
          categoryId: expect.any(CategoryId),
          name: 'Movie',
          description: null,
          isActive: false,
        },
      },
      {
        given: {
          categoryId: new CategoryId('f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e'),
          name: 'Movie',
          description: 'Movie category',
          isActive: true,
        },
        expected: {
          categoryId: new CategoryId('f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e'),
          name: 'Movie',
          description: 'Movie category',
          isActive: true,
        },
      },
    ];
    it.each(validProps)(
      'should create a new category with $given',
      ({ given, expected }) => {
        const category = Category.create(given);

        expect(category).toBeDefined();
        expect(category).toBeInstanceOf(Category);
        expect(category.categoryId).toBeInstanceOf(CategoryId);
        expect(category.categoryId).toEqual(expected.categoryId);
        expect(category.name).toBe(expected.name);
        expect(category.description).toBe(expected.description);
        expect(category.isActive).toBe(expected.isActive);
        expect(category.createdAt).toBeInstanceOf(Date);
      },
    );

    it('should notify an error with name', () => {
      const category = Category.create({ name: 'a'.repeat(256) });
      expect(category.notification.hasErrors()).toBe(true);
      expect(category.notification).toContainNotificationErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });

  describe('validate()', () => {
    it('should call the validator with the category', () => {
      const validateSpy = jest
        .spyOn(CategoryValidator.prototype, 'validate')
        .mockReturnValue(true);
      const category = new Category({ name: 'Movie' });
      category.validate();
      expect(validateSpy).toHaveBeenCalledWith(
        category.notification,
        category,
        undefined,
      );
      validateSpy.mockRestore();
    });
  });

  describe('entityId()', () => {
    it('should return the category id', () => {
      const category = Category.create({ name: 'Movie' });
      expect(category.entityId).toBe(category.categoryId);
    });
  });

  describe('changeName()', () => {
    const validNames = [
      {
        given: 'Documentary',
        expected: 'Documentary',
      },
      {
        given: 'TV Show',
        expected: 'TV Show',
      },
    ];
    it.each(validNames)(
      'should change the name of the category to $given',
      ({ given, expected }) => {
        const category = Category.create({ name: 'Movie' });
        category.changeName(given);
        expect(category.name).toBe(expected);
      },
    );

    it('should notify an error with name', () => {
      const category = Category.create({ name: 'Movie' });
      category.changeName('a'.repeat(256));
      expect(category.notification.hasErrors()).toBe(true);
      expect(category.notification).toContainNotificationErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });

  describe('changeDescription()', () => {
    const validDescriptions = [
      {
        given: 'Documentary description',
        expected: 'Documentary description',
      },
      {
        given: 'TV Show description',
        expected: 'TV Show description',
      },
      {
        given: null,
        expected: null,
      },
    ];
    it.each(validDescriptions)(
      'should change the description of the category to $given',
      ({ given, expected }) => {
        const category = Category.create({ name: 'Movie' });
        category.changeDescription(given);
        expect(category.description).toBe(expected);
      },
    );
  });

  describe('activate()', () => {
    it('should activate the category', () => {
      const category = Category.create({ name: 'Movie', isActive: false });
      category.activate();
      expect(category.isActive).toBe(true);
    });
  });

  describe('deactivate()', () => {
    it('should deactivate the category', () => {
      const category = Category.create({ name: 'Movie', isActive: true });
      category.deactivate();
      expect(category.isActive).toBe(false);
    });
  });

  describe('toJSON()', () => {
    it('should return a plain object representation of the category', () => {
      const category = Category.create({
        name: 'Movie',
        description: 'Movie category',
        isActive: true,
      });
      expect(category.toJSON()).toEqual({
        categoryId: category.categoryId.id,
        name: 'Movie',
        description: 'Movie category',
        isActive: true,
        createdAt: category.createdAt,
      });
    });
  });

  describe('fake()', () => {
    it('should return a FakeCategoryBuilder', () => {
      const fakeCategoryBuilder = Category.fake();
      expect(fakeCategoryBuilder).toBeDefined();
      expect(fakeCategoryBuilder.aCategory).toBeDefined();
      expect(fakeCategoryBuilder.someCategories).toBeDefined();
    });
  });
});
