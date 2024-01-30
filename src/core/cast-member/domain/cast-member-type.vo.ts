import { ValueObject } from '@core/shared/domain/value-objects/value-object';

export enum CAST_MEMBER_TYPES {
  DIRECTOR = 1,
  ACTOR = 2,
}

export class CastMemberType extends ValueObject {
  constructor(readonly type: CAST_MEMBER_TYPES) {
    super();
    this.validate();
  }

  protected validate() {
    const isValid = Object.values(CAST_MEMBER_TYPES).includes(this.type);
    if (!isValid) {
      throw new InvalidCastMemberTypeError(this.type);
    }
  }
}

export class InvalidCastMemberTypeError extends Error {
  constructor(type: CAST_MEMBER_TYPES) {
    super(`Invalid cast member type: ${type}`);
  }
}
