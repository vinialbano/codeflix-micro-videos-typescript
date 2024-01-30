import { CAST_MEMBER_TYPES, CastMemberType } from '../cast-member-type.vo';
import { CastMember, CastMemberId } from '../cast-member.aggregate';
import { CastMemberValidator } from '../cast-member.validator';

describe('CastMember Aggregate Unit Tests', () => {
  describe('constructor()', () => {
    const assertions = [
      {
        given: {
          name: 'George Lucas',
          type: new CastMemberType(CAST_MEMBER_TYPES.DIRECTOR),
        },
        expected: {
          castMemberId: expect.any(CastMemberId),
          name: 'George Lucas',
          type: new CastMemberType(CAST_MEMBER_TYPES.DIRECTOR),
          createdAt: expect.any(Date),
        },
      },
      {
        given: {
          name: 'Johnny Depp',
          type: new CastMemberType(CAST_MEMBER_TYPES.ACTOR),
        },
        expected: {
          castMemberId: expect.any(CastMemberId),
          name: 'Johnny Depp',
          type: new CastMemberType(CAST_MEMBER_TYPES.ACTOR),
          createdAt: expect.any(Date),
        },
      },
      {
        given: {
          name: 'George Lucas',
          type: new CastMemberType(CAST_MEMBER_TYPES.DIRECTOR),
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
        },
        expected: {
          castMemberId: expect.any(CastMemberId),
          name: 'George Lucas',
          type: new CastMemberType(CAST_MEMBER_TYPES.DIRECTOR),
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
        },
      },
      {
        given: {
          castMemberId: new CastMemberId(
            'f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e',
          ),
          name: 'Johnny Depp',
          type: new CastMemberType(CAST_MEMBER_TYPES.ACTOR),
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
        },
        expected: {
          castMemberId: new CastMemberId(
            'f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e',
          ),
          name: 'Johnny Depp',
          type: new CastMemberType(CAST_MEMBER_TYPES.ACTOR),
          createdAt: new Date('2021-01-01T00:00:00.000Z'),
        },
      },
    ];
    it.each(assertions)(
      'should create a new cast member with default values, given $given',
      async ({ given, expected }) => {
        const castMember = new CastMember(given);
        expect(castMember).toBeDefined();
        expect(castMember.castMemberId).toBeInstanceOf(CastMemberId);
        expect(castMember.castMemberId).toEqual(expected.castMemberId);
        expect(castMember.name).toEqual(expected.name);
        expect(castMember.type).toEqual(expected.type);
        expect(castMember.createdAt).toBeInstanceOf(Date);
        expect(castMember.createdAt).toEqual(expected.createdAt);
      },
    );
  });

  describe('create()', () => {
    const validProps = [
      {
        given: { name: 'George Lucas', type: new CastMemberType(1) },
        expected: {
          castMemberId: expect.any(CastMemberId),
          name: 'George Lucas',
          type: new CastMemberType(1),
        },
      },
      {
        given: { name: 'Johnny Depp', type: new CastMemberType(2) },
        expected: {
          castMemberId: expect.any(CastMemberId),
          name: 'Johnny Depp',
          type: new CastMemberType(2),
        },
      },
      {
        given: {
          castMemberId: new CastMemberId(
            'f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e',
          ),
          name: 'Johnny Depp',
          type: new CastMemberType(2),
        },
        expected: {
          castMemberId: new CastMemberId(
            'f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e',
          ),
          name: 'Johnny Depp',
          type: new CastMemberType(2),
        },
      },
    ];
    it.each(validProps)(
      'should create a new cast member with $given',
      ({ given, expected }) => {
        const validateSpy = jest.spyOn(CastMember.prototype, 'validate');
        const castMember = CastMember.create(given);

        expect(castMember).toBeDefined();
        expect(castMember.castMemberId).toBeInstanceOf(CastMemberId);
        expect(castMember.castMemberId).toEqual(expected.castMemberId);
        expect(castMember.name).toBe(expected.name);
        expect(castMember.type).toEqual(expected.type);
        expect(castMember.createdAt).toBeInstanceOf(Date);
        expect(validateSpy).toHaveBeenCalledTimes(1);
        expect(validateSpy).toHaveBeenCalledWith(['name']);
      },
    );

    it('should notify an error with name', () => {
      const category = CastMember.create({
        name: 'a'.repeat(256),
        type: new CastMemberType(1),
      });
      expect(category.notification.hasErrors()).toBe(true);
      expect(category.notification).toContainNotificationErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });

  describe('validate()', () => {
    it('should call the validator with the castMember', () => {
      const validateSpy = jest
        .spyOn(CastMemberValidator.prototype, 'validate')
        .mockReturnValue(true);
      const castMember = new CastMember({
        name: 'Johnny Depp',
        type: new CastMemberType(2),
      });
      castMember.validate();
      expect(validateSpy).toHaveBeenCalledWith(
        castMember.notification,
        castMember,
        undefined,
      );
      validateSpy.mockRestore();
    });
  });

  describe('entityId()', () => {
    it('should return the castMember id', () => {
      const castMember = CastMember.create({
        name: 'George Lucas',
        type: new CastMemberType(1),
      });
      expect(castMember.entityId).toBe(castMember.castMemberId);
    });
  });

  describe('changeName()', () => {
    const validNames = [
      {
        given: 'George Lucas',
        expected: 'George Lucas',
      },
      {
        given: 'Johnny Depp',
        expected: 'Johnny Depp',
      },
    ];
    it.each(validNames)(
      'should change the name to $given',
      ({ given, expected }) => {
        const castMember = CastMember.create({
          name: 'Steven Spielberg',
          type: new CastMemberType(1),
        });

        castMember.changeName(given);
        expect(castMember.name).toBe(expected);
      },
    );

    it('should notify an error with name', () => {
      const castMember = CastMember.create({
        name: 'Steven Spielberg',
        type: new CastMemberType(1),
      });
      castMember.changeName('a'.repeat(256));
      expect(castMember.notification.hasErrors()).toBe(true);
      expect(castMember.notification).toContainNotificationErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });

  describe('changeType()', () => {
    const validTypes = [
      {
        given: new CastMemberType(1),
        expected: new CastMemberType(1),
      },
      {
        given: new CastMemberType(2),
        expected: new CastMemberType(2),
      },
    ];
    it.each(validTypes)(
      'should change the type to $given',
      ({ given, expected }) => {
        const castMember = CastMember.create({
          name: 'Clint Eastwood',
          type: new CastMemberType(1),
        });

        castMember.changeType(given);
        expect(castMember.type).toEqual(expected);
      },
    );
  });

  describe('toJSON()', () => {
    it('should return the castMember as JSON', () => {
      const castMember = CastMember.create({
        name: 'Clint Eastwood',
        type: new CastMemberType(1),
      });
      expect(castMember.toJSON()).toEqual({
        castMemberId: castMember.castMemberId.id,
        name: 'Clint Eastwood',
        type: 1,
        createdAt: castMember.createdAt,
      });
    });
  });
});
