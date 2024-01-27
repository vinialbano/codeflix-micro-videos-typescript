import { Notification } from '../../../shared/domain/validators/notification';
import { UUID } from '../../../shared/domain/value-objects/uuid.vo';
import { Category, CategoryConstructorProps } from '../category.entity';
import { CategoryValidator } from '../category.validator';

describe('CategoryValidator', () => {
  describe('validate()', () => {
    const invalidCategories = [
      {
        given: {
          name: 'a'.repeat(256),
          description: null,
          isActive: true,
          createdAt: new Date(),
          categoryId: new UUID(),
        },
        expected: {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      },
    ];
    it.each(invalidCategories)(
      'should include errors for invalid fields with $given',
      ({ given, expected }) => {
        const categoryValidator = new CategoryValidator();
        const notification = new Notification();
        const isValid = categoryValidator.validate(
          notification,
          given as Category,
          undefined,
        );
        expect(isValid).toBe(false);
        expect(notification.hasErrors()).toBe(true);
        expect(notification).toContainNotificationErrorMessages([expected]);
      },
    );
  });

  const validCategories = [
    {
      name: 'Movie',
      description: null,
      isActive: true,
      createdAt: new Date(),
      categoryId: new UUID(),
    },
    {
      name: 'Movie',
      description: 'A movie',
      isActive: true,
      createdAt: new Date(),
      categoryId: new UUID(),
    },
    {
      name: 'Movie',
      description: 'A movie',
      isActive: false,
      createdAt: new Date(),
      categoryId: new UUID(),
    },
  ];

  it.each(validCategories)(
    'should not include errors with $category',
    (category) => {
      const categoryValidator = new CategoryValidator();
      const notification = new Notification();
      const isValid = categoryValidator.validate(
        notification,
        category as Category,
        undefined,
      );
      expect(isValid).toBe(true);
      expect(notification.hasErrors()).toBe(false);
    },
  );
});
