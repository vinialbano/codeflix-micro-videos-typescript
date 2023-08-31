import { EntityValidationError, UniqueEntityID } from '#seedwork/domain';
import { Category } from '../category';
import { CategoryTestBuilder } from '../category.test-builder';

describe('CategoryTestBuiler Unit Tests', () => {
  describe('aCategory()', () => {
    it('should create a CategoryTestBuilder instance with count = 1', () => {
      const builder = CategoryTestBuilder.aCategory();
      expect(builder).toBeInstanceOf(CategoryTestBuilder);
      expect(builder['count']).toBe(1);
    });

    it('should initiate the builder with default factories', () => {
      const builder = CategoryTestBuilder.aCategory();
      const chance = builder['chance'];
      const spyOnName = jest.spyOn(chance, 'name');
      const spyOnDescription = jest.spyOn(chance, 'sentence');

      expect(builder['factories']).toStrictEqual({
        id: undefined,
        name: expect.any(Function),
        description: expect.any(Function),
        isActive: undefined,
        createdAt: undefined,
      });

      builder['factories'].name(0);
      expect(spyOnName).toHaveBeenCalledTimes(1);
      builder['factories'].description(0);
      expect(spyOnDescription).toHaveBeenCalledTimes(1);
    });
  });

  describe('manyCategories()', () => {
    describe('should create a CategoryTestBuilder instance with the informed count', () => {
      it.each([2, 5, 10])('works with count = %p', (count) => {
        const builder = CategoryTestBuilder.manyCategories(count);
        expect(builder).toBeInstanceOf(CategoryTestBuilder);
        expect(builder['count']).toBe(count);
      });
    });

    it('should initiate the builder with default factories', () => {
      const builder = CategoryTestBuilder.manyCategories(5);
      const chance = builder['chance'];
      const spyOnName = jest.spyOn(chance, 'name');
      const spyOnDescription = jest.spyOn(chance, 'sentence');

      expect(builder['factories']).toStrictEqual({
        id: undefined,
        name: expect.any(Function),
        description: expect.any(Function),
        isActive: undefined,
        createdAt: undefined,
      });

      builder['factories'].name(0);
      expect(spyOnName).toHaveBeenCalledTimes(1);
      builder['factories'].description(0);
      expect(spyOnDescription).toHaveBeenCalledTimes(1);
    });
  });

  describe('reset()', () => {
    it('should reset the factories', () => {
      const builder = CategoryTestBuilder.aCategory();
      const mockFactories = {
        id: jest.fn(),
        name: jest.fn(),
        description: jest.fn(),
        isActive: jest.fn(),
        createdAt: jest.fn(),
      };
      const chance = builder['chance'];
      const spyOnName = jest.spyOn(chance, 'name');
      const spyOnDescription = jest.spyOn(chance, 'sentence');

      builder['factories'] = mockFactories;
      builder.reset();
      expect(builder['factories']).toStrictEqual({
        id: undefined,
        name: expect.any(Function),
        description: expect.any(Function),
        isActive: undefined,
        createdAt: undefined,
      });
      expect(builder['factories'].name).not.toEqual(mockFactories.name);
      expect(builder['factories'].description).not.toEqual(
        mockFactories.description,
      );
      builder['factories'].name(0);
      expect(spyOnName).toHaveBeenCalledTimes(1);
      builder['factories'].description(0);
      expect(spyOnDescription).toHaveBeenCalledTimes(1);
    });
  });

  describe('valid factories', () => {
    describe('withId()', () => {
      it('should set the id factory', () => {
        const builder = CategoryTestBuilder.aCategory();
        const mockFactory = jest.fn();
        builder.withId(mockFactory);
        expect(builder['factories'].id).toEqual(mockFactory);
      });

      it('should set the id factory with a value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = new UniqueEntityID(
          '123a456b-890c-432a-b101-c234d567e890',
        );
        builder.withId(value);
        expect(builder['factories'].id!(0)).toEqual(value);
      });

      it('should return the builder instance', () => {
        const builder = CategoryTestBuilder.aCategory();
        const result = builder.withId(jest.fn());
        expect(result).toBe(builder);
      });
    });

    describe('withName()', () => {
      it('should set the name factory', () => {
        const builder = CategoryTestBuilder.aCategory();
        const mockFactory = jest.fn();
        builder.withName(mockFactory);
        expect(builder['factories'].name).toEqual(mockFactory);
      });

      it('should set the name factory with a value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = 'Category 1';
        builder.withName(value);
        expect(builder['factories'].name(0)).toEqual(value);
      });

      it('should return the builder instance', () => {
        const builder = CategoryTestBuilder.aCategory();
        const result = builder.withName(jest.fn());
        expect(result).toBe(builder);
      });
    });

    describe('withDescription()', () => {
      it('should set the description factory', () => {
        const builder = CategoryTestBuilder.aCategory();
        const mockFactory = jest.fn();
        builder.withDescription(mockFactory);
        expect(builder['factories'].description).toEqual(mockFactory);
      });

      it('should set the description factory with a value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = 'Category 1 description';
        builder.withDescription(value);
        expect(builder['factories'].description(0)).toEqual(value);
      });

      it('should set the description factory with null', () => {
        const builder = CategoryTestBuilder.aCategory();
        builder.withDescription(null);
        expect(builder['factories'].description(0)).toEqual(null);
      });

      it('should return the builder instance', () => {
        const builder = CategoryTestBuilder.aCategory();
        const result = builder.withDescription(jest.fn());
        expect(result).toBe(builder);
      });
    });

    describe('withIsActive()', () => {
      it('should set the isActive factory', () => {
        const builder = CategoryTestBuilder.aCategory();
        const mockFactory = jest.fn();
        builder.withIsActive(mockFactory);
        expect(builder['factories'].isActive).toEqual(mockFactory);
      });

      it('should set the isActive factory with a value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = true;
        builder.withIsActive(value);
        expect(builder['factories'].isActive!(0)).toEqual(value);
      });

      it('should return the builder instance', () => {
        const builder = CategoryTestBuilder.aCategory();
        const result = builder.withIsActive(jest.fn());
        expect(result).toBe(builder);
      });
    });

    describe('active()', () => {
      it('should set the isActive factory with true', () => {
        const builder = CategoryTestBuilder.aCategory();
        builder.active();
        expect(builder['factories'].isActive!(0)).toEqual(true);
      });

      it('should return the builder instance', () => {
        const builder = CategoryTestBuilder.aCategory();
        const result = builder.active();
        expect(result).toBe(builder);
      });
    });

    describe('inactive()', () => {
      it('should set the isActive factory with false', () => {
        const builder = CategoryTestBuilder.aCategory();
        builder.inactive();
        expect(builder['factories'].isActive!(0)).toEqual(false);
      });

      it('should return the builder instance', () => {
        const builder = CategoryTestBuilder.aCategory();
        const result = builder.inactive();
        expect(result).toBe(builder);
      });
    });

    describe('withCreatedAt()', () => {
      it('should set the createdAt factory', () => {
        const builder = CategoryTestBuilder.aCategory();
        const mockFactory = jest.fn();
        builder.withCreatedAt(mockFactory);
        expect(builder['factories'].createdAt).toEqual(mockFactory);
      });

      it('should set the createdAt factory with a value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = new Date();
        builder.withCreatedAt(value);
        expect(builder['factories'].createdAt!(0)).toEqual(value);
      });

      it('should return the builder instance', () => {
        const builder = CategoryTestBuilder.aCategory();
        const result = builder.withCreatedAt(jest.fn());
        expect(result).toBe(builder);
      });
    });
  });

  describe('invalid factories', () => {
    describe('withInvalidIdIsNotUniqueEntityID()', () => {
      it('should set the id factory with a default value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const chance = builder['chance'];
        const spyOnString = jest.spyOn(chance, 'string');
        builder.withInvalidIdIsNotUniqueEntityID();
        const id = builder['factories'].id!(0);
        expect(spyOnString).toHaveBeenCalledTimes(1);
        expect(id).toEqual(spyOnString.mock.results[0].value);
      });

      it('should set the id factory with a value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = '1';
        builder.withInvalidIdIsNotUniqueEntityID(value);
        expect(builder['factories'].id!(0)).toEqual(value);
      });

      it('should set the id factory with a function', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = () => '1';
        builder.withInvalidIdIsNotUniqueEntityID(value);
        expect(builder['factories'].id).toEqual(value);
      });

      it('should return the builder instance', () => {
        const builder = CategoryTestBuilder.aCategory();
        const result = builder.withInvalidIdIsNotUniqueEntityID();
        expect(result).toBe(builder);
      });
    });

    describe('withInvalidNameIsNotString()', () => {
      it('should set the name factory with a default value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const chance = builder['chance'];
        const spyOnInteger = jest.spyOn(chance, 'integer');
        builder.withInvalidNameIsNotString();
        const name = builder['factories'].name(0);
        expect(spyOnInteger).toHaveBeenCalledTimes(1);
        expect(name).toEqual(spyOnInteger.mock.results[0].value);
      });

      it('should set the name factory with a value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = 1;
        builder.withInvalidNameIsNotString(value);
        expect(builder['factories'].name(0)).toEqual(value);
      });

      it('should set the name factory with a function', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = () => 1;
        builder.withInvalidNameIsNotString(value);
        expect(builder['factories'].name).toEqual(value);
      });

      it('should return the builder instance', () => {
        const builder = CategoryTestBuilder.aCategory();
        const result = builder.withInvalidNameIsNotString();
        expect(result).toBe(builder);
      });
    });

    describe('withInvalidNameIsTooShort()', () => {
      it('should set the name factory with a default value', () => {
        const builder = CategoryTestBuilder.aCategory();
        builder.withInvalidNameIsTooShort();
        const name = builder['factories'].name(0);
        expect(name).toEqual('');
      });

      it('should set the name factory with a value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = '';
        builder.withInvalidNameIsTooShort(value);
        expect(builder['factories'].name(0)).toEqual(value);
      });

      it('should set the name factory with a function', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = () => '';
        builder.withInvalidNameIsTooShort(value);
        expect(builder['factories'].name).toEqual(value);
      });

      it('should return the builder instance', () => {
        const builder = CategoryTestBuilder.aCategory();
        const result = builder.withInvalidNameIsTooShort();
        expect(result).toBe(builder);
      });
    });

    describe('withInvalidNameIsTooLong()', () => {
      it('should set the name factory with a default value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const chance = builder['chance'];
        const spyOnString = jest.spyOn(chance, 'string');
        builder.withInvalidNameIsTooLong();
        const name = builder['factories'].name(0);
        expect(spyOnString).toHaveBeenCalledTimes(1);
        expect(name).toEqual(spyOnString.mock.results[0].value);
      });

      it('should set the name factory with a value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = 'a'.repeat(256);
        builder.withInvalidNameIsTooLong(value);
        expect(builder['factories'].name(0)).toEqual(value);
      });

      it('should set the name factory with a function', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = () => 'a'.repeat(256);
        builder.withInvalidNameIsTooLong(value);
        expect(builder['factories'].name).toEqual(value);
      });

      it('should return the builder instance', () => {
        const builder = CategoryTestBuilder.aCategory();
        const result = builder.withInvalidNameIsTooLong();
        expect(result).toBe(builder);
      });
    });

    describe('withInvalidDescriptionIsNotStringOrNull()', () => {
      it('should set the description factory with a default value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const chance = builder['chance'];
        const spyOnInteger = jest.spyOn(chance, 'integer');
        builder.withInvalidDescriptionIsNotStringOrNull();
        const description = builder['factories'].description(0);
        expect(spyOnInteger).toHaveBeenCalledTimes(1);
        expect(description).toEqual(spyOnInteger.mock.results[0].value);
      });

      it('should set the description factory with a value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = 1;
        builder.withInvalidDescriptionIsNotStringOrNull(value);
        expect(builder['factories'].description(0)).toEqual(value);
      });

      it('should set the description factory with a function', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = () => 1;
        builder.withInvalidDescriptionIsNotStringOrNull(value);
        expect(builder['factories'].description).toEqual(value);
      });

      it('should return the builder instance', () => {
        const builder = CategoryTestBuilder.aCategory();
        const result = builder.withInvalidDescriptionIsNotStringOrNull();
        expect(result).toBe(builder);
      });
    });

    describe('withInvalidIsActiveIsNotBoolean()', () => {
      it('should set the isActive factory with a default value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const chance = builder['chance'];
        const spyOnInteger = jest.spyOn(chance, 'integer');
        builder.withInvalidIsActiveIsNotBoolean();
        const isActive = builder['factories'].isActive!(0);
        expect(spyOnInteger).toHaveBeenCalledTimes(1);
        expect(isActive).toEqual(spyOnInteger.mock.results[0].value);
      });

      it('should set the isActive factory with a value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = 1;
        builder.withInvalidIsActiveIsNotBoolean(value);
        expect(builder['factories'].isActive!(0)).toEqual(value);
      });

      it('should set the isActive factory with a function', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = () => 1;
        builder.withInvalidIsActiveIsNotBoolean(value);
        expect(builder['factories'].isActive).toEqual(value);
      });

      it('should return the builder instance', () => {
        const builder = CategoryTestBuilder.aCategory();
        const result = builder.withInvalidIsActiveIsNotBoolean();
        expect(result).toBe(builder);
      });
    });

    describe('withInvalidCreatedAtIsNotDate()', () => {
      it('should set the createdAt factory with a default value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const chance = builder['chance'];
        const spyOnInteger = jest.spyOn(chance, 'integer');
        builder.withInvalidCreatedAtIsNotDate();
        const createdAt = builder['factories'].createdAt!(0);
        expect(spyOnInteger).toHaveBeenCalledTimes(1);
        expect(createdAt).toEqual(spyOnInteger.mock.results[0].value);
      });

      it('should set the createdAt factory with a value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = 1;
        builder.withInvalidCreatedAtIsNotDate(value);
        expect(builder['factories'].createdAt!(0)).toEqual(value);
      });

      it('should set the createdAt factory with a function', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = () => 1;
        builder.withInvalidCreatedAtIsNotDate(value);
        expect(builder['factories'].createdAt).toEqual(value);
      });

      it('should return the builder instance', () => {
        const builder = CategoryTestBuilder.aCategory();
        const result = builder.withInvalidCreatedAtIsNotDate();
        expect(result).toBe(builder);
      });
    });
  });

  describe('build()', () => {
    it('should build a Category instance with the default factories', () => {
      const categoryBuilder = CategoryTestBuilder.aCategory();
      const chance = categoryBuilder['chance'];
      const spyOnName = jest.spyOn(chance, 'name');
      const spyOnDescription = jest.spyOn(chance, 'sentence');

      const category = categoryBuilder.build();

      expect(category).toBeInstanceOf(Category);
      expect(spyOnName).toHaveBeenCalledTimes(1);
      expect(category.name).toEqual(spyOnName.mock.results[0].value);
      expect(spyOnDescription).toHaveBeenCalledTimes(1);
      expect(category.description).toEqual(
        spyOnDescription.mock.results[0].value,
      );
    });

    it('should build many Category instances with the default factories', () => {
      const categoriesBuilder = CategoryTestBuilder.manyCategories(5);
      const chance = categoriesBuilder['chance'];
      const spyOnName = jest.spyOn(chance, 'name');
      const spyOnDescription = jest.spyOn(chance, 'sentence');

      const categories = categoriesBuilder.build();

      expect(categories).toBeInstanceOf(Array);
      expect(categories.length).toBe(5);
      expect(spyOnName).toHaveBeenCalledTimes(5);
      expect(spyOnDescription).toHaveBeenCalledTimes(5);
      categories.forEach((category, i) => {
        expect(category).toBeInstanceOf(Category);
        expect(category.name).toEqual(spyOnName.mock.results[i].value);
        expect(category.description).toEqual(
          spyOnDescription.mock.results[i].value,
        );
      });
    });

    it('should build a Category instance with the informed values', () => {
      const categoryBuilder = CategoryTestBuilder.aCategory()
        .withId(new UniqueEntityID('123a456b-890c-432a-b101-c234d567e890'))
        .withName('Category 1')
        .withDescription('Category 1 description')
        .active()
        .withCreatedAt(new Date());
      const category = categoryBuilder.build();
      expect(category).toBeInstanceOf(Category);
      expect(category.id.toString()).toEqual(
        '123a456b-890c-432a-b101-c234d567e890',
      );
      expect(category.name).toEqual('Category 1');
      expect(category.description).toEqual('Category 1 description');
      expect(category.isActive).toEqual(true);
      expect(category.createdAt).toBeInstanceOf(Date);
    });

    it('should build many Category instances with the informed values', () => {
      const categoriesBuilder = CategoryTestBuilder.manyCategories(5)
        .withId(new UniqueEntityID('123a456b-890c-432a-b101-c234d567e890'))
        .withName('Category 1')
        .withDescription('Category 1 description')
        .inactive()
        .withCreatedAt(new Date());
      const categories = categoriesBuilder.build();
      expect(categories).toBeInstanceOf(Array);
      expect(categories.length).toBe(5);
      categories.forEach((category) => {
        expect(category).toBeInstanceOf(Category);
        expect(category.id.toString()).toEqual(
          '123a456b-890c-432a-b101-c234d567e890',
        );
        expect(category.name).toEqual('Category 1');
        expect(category.description).toEqual('Category 1 description');
        expect(category.isActive).toEqual(false);
        expect(category.createdAt).toBeInstanceOf(Date);
      });
    });

    it('should build a Category instance with the informed values using factories', () => {
      const categoryBuilder = CategoryTestBuilder.aCategory()
        .withId(
          (i) => new UniqueEntityID(`123a456b-890c-432a-b101-c234d567e89${i}`),
        )
        .withName((i) => `Category ${i}`)
        .withDescription((i) => `Category ${i} description`)
        .withIsActive((i) => i % 2 === 0)
        .withCreatedAt((i) => new Date(2023, 0, i + 1));
      const category = categoryBuilder.build();
      expect(category).toBeInstanceOf(Category);
      expect(category.id.toString()).toEqual(
        '123a456b-890c-432a-b101-c234d567e890',
      );
      expect(category.name).toEqual('Category 0');
      expect(category.description).toEqual('Category 0 description');
      expect(category.isActive).toEqual(true);
      expect(category.createdAt).toEqual(new Date('2023-01-01'));
    });

    it('should build many Category instances with the informed values using factories', () => {
      const categoriesBuilder = CategoryTestBuilder.manyCategories(5)
        .withId(
          (i) => new UniqueEntityID(`123a456b-890c-432a-b101-c234d567e89${i}`),
        )
        .withName((i) => `Category ${i}`)
        .withDescription((i) => `Category ${i} description`)
        .withIsActive((i) => i % 2 === 0)
        .withCreatedAt((i) => new Date(2023, 0, i + 1));
      const categories = categoriesBuilder.build();
      expect(categories).toBeInstanceOf(Array);
      expect(categories.length).toBe(5);
      categories.forEach((category, i) => {
        expect(category).toBeInstanceOf(Category);
        expect(category.id.toString()).toEqual(
          `123a456b-890c-432a-b101-c234d567e89${i}`,
        );
        expect(category.name).toEqual(`Category ${i}`);
        expect(category.description).toEqual(`Category ${i} description`);
        expect(category.isActive).toEqual(i % 2 === 0);
        expect(category.createdAt).toEqual(new Date(`2023-01-0${i + 1}`));
      });
    });

    it('should throw an error if an invalid id is provided', () => {
      const categoryBuilder =
        CategoryTestBuilder.aCategory().withInvalidIdIsNotUniqueEntityID();
      expect(() => categoryBuilder.build()).toThrowError(EntityValidationError);
    });

    it('should throw an error if an invalid name is provided', () => {
      const categoryBuilders = [
        CategoryTestBuilder.aCategory().withInvalidNameIsNotString(),
        CategoryTestBuilder.aCategory().withInvalidNameIsTooShort(),
        CategoryTestBuilder.aCategory().withInvalidNameIsTooLong(),
      ];
      categoryBuilders.forEach((categoryBuilder) => {
        expect(() => categoryBuilder.build()).toThrowError(
          EntityValidationError,
        );
      });
    });

    it('should throw an error if an invalid description is provided', () => {
      const categoryBuilder =
        CategoryTestBuilder.aCategory().withInvalidDescriptionIsNotStringOrNull();
      expect(() => categoryBuilder.build()).toThrowError(EntityValidationError);
    });

    it('should throw an error if an invalid isActive is provided', () => {
      const categoryBuilder =
        CategoryTestBuilder.aCategory().withInvalidIsActiveIsNotBoolean();
      expect(() => categoryBuilder.build()).toThrowError(EntityValidationError);
    });

    it('should throw an error if an invalid createdAt is provided', () => {
      const categoryBuilder =
        CategoryTestBuilder.aCategory().withInvalidCreatedAtIsNotDate();
      expect(() => categoryBuilder.build()).toThrowError(EntityValidationError);
    });
  });

  describe('getters', () => {
    describe('id()', () => {
      it('should throw an error if the id factory is not set', () => {
        const builder = CategoryTestBuilder.aCategory();
        expect(() => builder.id).toThrowError(
          'The id factory is not set. You must set it using "with" methods before calling this method.',
        );
      });

      it('should return the id factory value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = new UniqueEntityID(
          '123a456b-890c-432a-b101-c234d567e890',
        );
        builder.withId(value);
        expect(builder.id).toEqual(value);

        builder.withId(() => value);
        expect(builder.id).toEqual(value);

        builder.withInvalidIdIsNotUniqueEntityID(() => 'id');
        expect(builder.id).toEqual('id');
      });
    });

    describe('name()', () => {
      it('should return the name factory value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = 'Category 1';
        builder.withName(value);
        expect(builder.name).toEqual(value);

        builder.withName(() => value);
        expect(builder.name).toEqual(value);

        builder.withInvalidNameIsNotString(() => 1);
        expect(builder.name).toEqual(1);

        builder.withInvalidNameIsTooShort(() => '');
        expect(builder.name).toEqual('');

        builder.withInvalidNameIsTooLong(() => 'a'.repeat(256));
        expect(builder.name).toEqual('a'.repeat(256));
      });
    });

    describe('description()', () => {
      it('should return the description factory value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = 'Category 1 description';
        builder.withDescription(value);
        expect(builder.description).toEqual(value);

        builder.withDescription(() => value);
        expect(builder.description).toEqual(value);

        builder.withInvalidDescriptionIsNotStringOrNull(() => 1);
        expect(builder.description).toEqual(1);
      });
    });

    describe('isActive()', () => {
      it('should throw an error if the isActive factory is not set', () => {
        const builder = CategoryTestBuilder.aCategory();
        expect(() => builder.isActive).toThrowError(
          'The isActive factory is not set. You must set it using "with" methods before calling this method.',
        );
      });

      it('should return the isActive factory value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = true;
        builder.withIsActive(value);
        expect(builder.isActive).toEqual(value);

        builder.withIsActive(() => value);
        expect(builder.isActive).toEqual(value);

        builder.withInvalidIsActiveIsNotBoolean(() => 1);
        expect(builder.isActive).toEqual(1);
      });
    });

    describe('createdAt()', () => {
      it('should throw an error if the createdAt factory is not set', () => {
        const builder = CategoryTestBuilder.aCategory();
        expect(() => builder.createdAt).toThrowError(
          'The createdAt factory is not set. You must set it using "with" methods before calling this method.',
        );
      });

      it('should return the createdAt factory value', () => {
        const builder = CategoryTestBuilder.aCategory();
        const value = new Date();
        builder.withCreatedAt(value);
        expect(builder.createdAt).toEqual(value);

        builder.withCreatedAt(() => value);
        expect(builder.createdAt).toEqual(value);

        builder.withInvalidCreatedAtIsNotDate(() => 1 as const);
        expect(builder.createdAt).toEqual(1);
      });
    });
  });
});
