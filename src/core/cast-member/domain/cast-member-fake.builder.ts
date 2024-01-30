import { Chance } from 'chance';
import { CastMember, CastMemberId } from './cast-member.aggregate';
import { CAST_MEMBER_TYPES, CastMemberType } from './cast-member-type.vo';

type PropOrFactory<T> = T | ((i: number) => T);

export class CastMemberFakeBuilder<TBuild = any> {
  private _castMemberId: PropOrFactory<CastMemberId> | undefined = undefined;

  private _name: PropOrFactory<string> = () => this.chance.word();

  private _type: PropOrFactory<CastMemberType> = () =>
    this.chance.pickone([
      new CastMemberType(CAST_MEMBER_TYPES.ACTOR),
      new CastMemberType(CAST_MEMBER_TYPES.DIRECTOR),
    ]);

  private _createdAt: PropOrFactory<Date> | undefined = undefined;

  private countObjs;

  static aCastMember() {
    return new CastMemberFakeBuilder<CastMember>();
  }

  static someCastMembers(count: number) {
    return new CastMemberFakeBuilder<CastMember[]>(count);
  }

  private chance: Chance.Chance;

  private constructor(count: number = 1) {
    this.countObjs = count;
    this.chance = Chance();
  }

  withCastMemberId(valueOrFactory: PropOrFactory<CastMemberId>) {
    this._castMemberId = valueOrFactory;
    return this;
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory;
    return this;
  }

  withType(valueOrFactory: PropOrFactory<CastMemberType>) {
    this._type = valueOrFactory;
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._createdAt = valueOrFactory;
    return this;
  }

  withInvalidNameTooLong(value?: string) {
    this._name = value ?? (() => this.chance.word({ length: 256 }));
    return this;
  }

  build(): TBuild extends CastMember[] ? CastMember[] : CastMember {
    const categories = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        const castMember = new CastMember({
          castMemberId: !this._castMemberId
            ? undefined
            : this.callFactory(this._castMemberId, index),
          name: this.callFactory(this._name, index),
          type: this.callFactory(this._type, index),
          ...(this._createdAt && {
            createdAt: this.callFactory(this._createdAt, index),
          }),
        });
        castMember.validate();
        return castMember;
      });
    return this.countObjs === 1 ? (categories[0] as any) : categories;
  }

  private callFactory<T>(valueOrFactory: PropOrFactory<T>, index: number) {
    return typeof valueOrFactory === 'function'
      ? (valueOrFactory as any)(index)
      : valueOrFactory;
  }

  get castMemberId() {
    return this.getValue('castMemberId');
  }

  get name() {
    return this.getValue('name');
  }

  get type() {
    return this.getValue('type');
  }

  get createdAt() {
    return this.getValue('createdAt');
  }

  private getValue(prop: string) {
    const optional = ['castMemberId', 'createdAt'];
    const privateProp = `_${prop}` as keyof this;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} does not have a factory. Use with${
          prop.charAt(0).toUpperCase() + prop.slice(1)
        }() method to set a factory.`,
      );
    }
    return this.callFactory(this[privateProp], 0);
  }
}
