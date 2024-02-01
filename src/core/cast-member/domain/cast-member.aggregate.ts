import { AggregateRoot } from '../../shared/domain/aggregate-root';
import { includeIfDefined } from '../../shared/utils';
import { UUID } from '../../shared/domain/value-objects/uuid.vo';
import { CastMemberType } from './cast-member-type.vo';
import { CastMemberValidatorFactory } from './cast-member.validator';
import { CastMemberFakeBuilder } from './cast-member-fake.builder';

export type CastMemberConstructorProps = {
  castMemberId?: CastMemberId;
  name: string;
  type: CastMemberType;
  createdAt?: Date;
};

export type CastMemberCreateCommandProps = {
  castMemberId?: CastMemberId;
  name: string;
  type: CastMemberType;
};

export class CastMemberId extends UUID {}

export class CastMember extends AggregateRoot {
  castMemberId: CastMemberId;
  name: string;
  type: CastMemberType;
  createdAt: Date;

  constructor(props: CastMemberConstructorProps) {
    super();
    this.castMemberId = props.castMemberId ?? new CastMemberId();
    this.name = props.name;
    this.type = props.type;
    this.createdAt = props.createdAt ?? new Date();
  }

  static create(props: CastMemberCreateCommandProps) {
    const castMember = new CastMember({
      name: props.name,
      type: props.type,
      ...includeIfDefined(props.castMemberId, 'castMemberId'),
    });
    castMember.validate(['name']);

    return castMember;
  }

  validate(fields?: string[]) {
    const validator = CastMemberValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  get entityId() {
    return this.castMemberId;
  }

  changeName(name: string) {
    this.name = name;
    this.validate(['name']);
  }

  changeType(type: CastMemberType) {
    this.type = type;
  }

  toJSON() {
    return {
      castMemberId: this.castMemberId.id,
      name: this.name,
      type: this.type.type,
      createdAt: this.createdAt,
    };
  }

  static fake() {
    return CastMemberFakeBuilder;
  }
}
