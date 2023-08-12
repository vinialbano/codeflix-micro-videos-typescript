import { Category, CategoryProperties } from '#category/domain';

describe('Category Integration Tests', () => {
  describe('constructor()', () => {
    it.each([
      {
        name: null,
        error: 'Expected string, received null',
      },
      {
        name: '',
        error: 'String must contain at least 1 character(s)',
      },
      {
        name: ' '.repeat(5),
        error: 'String must contain at least 1 character(s)',
      },
      {
        name: 5 as any,
        error: 'Expected string, received number',
      },
      {
        name: 't'.repeat(256),
        error: 'String must contain at most 255 character(s)',
      },
    ])('should throw an error if name is invalid', ({ name, error }) => {
      expect(() => new Category({ name })).toContainErrorMessages({
        name: {
          _errors: [error],
        },
      });
    });

    it.each([
      {
        description: 5 as any,
        error: 'Expected string, received number',
      },
    ])(
      'should throw an error if description is invalid',
      ({ description, error }) => {
        expect(
          () => new Category({ name: 'Movie', description }),
        ).toContainErrorMessages({
          description: {
            _errors: [error],
          },
        });
      },
    );

    it.each([
      {
        isActive: 5 as any,
        error: 'Expected boolean, received number',
      },
    ])(
      'should throw an error if isActive is invalid',
      ({ isActive, error }) => {
        expect(
          () => new Category({ name: 'Movie', isActive }),
        ).toContainErrorMessages({
          isActive: {
            _errors: [error],
          },
        });
      },
    );

    it.each([
      {
        createdAt: 5 as any,
        error: 'Expected date, received number',
      },
    ])(
      'should throw an error if createdAt is invalid',
      ({ createdAt, error }) => {
        expect(
          () => new Category({ name: 'Movie', createdAt }),
        ).toContainErrorMessages({
          createdAt: {
            _errors: [error],
          },
        });
      },
    );

    it.each<CategoryProperties>([
      {
        name: 'Movie',
      },
      {
        name: 'Movie',
        description: 'Movie description',
      },
      {
        name: 'Movie',
        isActive: false,
      },
      {
        name: 'Movie',
        createdAt: new Date(),
      },
    ])(
      `should create a category`,
      ({ name, description, isActive, createdAt }) => {
        const category = new Category({
          name,
          description,
          isActive,
          createdAt,
        });
        expect(category).toBeDefined();
      },
    );
  });

  describe('update()', () => {
    it.each([
      {
        name: null,
        error: 'Expected string, received null',
      },
      {
        name: '',
        error: 'String must contain at least 1 character(s)',
      },
      {
        name: ' '.repeat(5),
        error: 'String must contain at least 1 character(s)',
      },
      {
        name: 5 as any,
        error: 'Expected string, received number',
      },
      {
        name: 't'.repeat(256),
        error: 'String must contain at most 255 character(s)',
      },
    ])('should throw an error if name is invalid', ({ name, error }) => {
      expect(() =>
        new Category({ name }).update(name, undefined),
      ).toContainErrorMessages({
        name: {
          _errors: [error],
        },
      });
    });

    it.each([
      {
        description: 5 as any,
        error: 'Expected string, received number',
      },
    ])(
      'should throw an error if description is invalid',
      ({ description, error }) => {
        expect(() =>
          new Category({ name: 'Movie' }).update('Movie', description),
        ).toContainErrorMessages({
          description: {
            _errors: [error],
          },
        });
      },
    );

    it.each([
      {
        name: 'Series',
      },
      {
        name: 'Series',
        description: 'Series description',
      },
      {
        name: 'Series',
        description: null,
      },
    ])(`should update a category`, ({ name, description }) => {
      const category = new Category({ name: 'Movie' });
      expect(() => category.update(name, description)).not.toThrow();
    });
  });
});
