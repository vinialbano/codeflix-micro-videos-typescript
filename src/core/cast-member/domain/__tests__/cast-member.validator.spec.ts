import { Notification } from '../../../shared/domain/validators/notification';
import { CastMemberType } from '../cast-member-type.vo';
import { CastMember, CastMemberId } from '../cast-member.aggregate';
import { CastMemberValidator } from '../cast-member.validator';

describe('CastMemberValidator', () => {
  describe('validate()', () => {
    const invalidCategories = [
      {
        given: {
          name: 'a'.repeat(256),
          type: new CastMemberType(1),
          createdAt: new Date(),
          castMemberId: new CastMemberId(),
        },
        expected: {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      },
    ];
    it.each(invalidCategories)(
      'should include errors for invalid fields with $given',
      ({ given, expected }) => {
        const castMemberValidator = new CastMemberValidator();
        const notification = new Notification();
        const isValid = castMemberValidator.validate(
          notification,
          given as CastMember,
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
      name: 'George Lucas',
      type: new CastMemberType(1),
      createdAt: new Date(),
      castMemberId: new CastMemberId(),
    },
    {
      name: 'Johnny Depp',
      type: new CastMemberType(2),
      createdAt: new Date(),
      castMemberId: new CastMemberId(),
    },
  ];

  it.each(validCategories)(
    'should not include errors with %p',
    (castMember) => {
      const castMemberValidator = new CastMemberValidator();
      const notification = new Notification();
      const isValid = castMemberValidator.validate(
        notification,
        castMember as CastMember,
        undefined,
      );
      expect(isValid).toBe(true);
      expect(notification.hasErrors()).toBe(false);
    },
  );
});
