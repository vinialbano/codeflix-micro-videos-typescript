import {
  CAST_MEMBER_TYPES,
  CastMemberType,
  InvalidCastMemberTypeError,
} from '../cast-member-type.vo';

describe('CastMemberType Unit Tests', () => {
  describe('constructor()', () => {
    const validateSpy = jest.spyOn(CastMemberType.prototype, 'validate' as any);
    it('should throw InvalidCastMemberError when type is invalid', () => {
      expect(() => new CastMemberType(3 as any)).toThrow(
        InvalidCastMemberTypeError,
      );
      expect(validateSpy).toHaveBeenCalled();
    });

    describe('should return a CastMemberType instance when type is valid', () => {
      const arrange = [CAST_MEMBER_TYPES.DIRECTOR, CAST_MEMBER_TYPES.ACTOR];
      it.each(arrange)('with type: %s', (value) => {
        expect(new CastMemberType(value)).toBeInstanceOf(CastMemberType);
        expect(validateSpy).toHaveBeenCalled();
      });
    });
  });
});

describe('InvalidCastMemberTypeError Unit Tests', () => {
  it('should return a InvalidCastMemberTypeError instance', () => {
    const error = new InvalidCastMemberTypeError(1);
    expect(error).toBeInstanceOf(InvalidCastMemberTypeError);
    expect(error.message).toBe('Invalid cast member type: 1');
  });
});
