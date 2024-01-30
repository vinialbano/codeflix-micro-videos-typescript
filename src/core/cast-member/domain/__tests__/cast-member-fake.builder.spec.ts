import { Chance } from 'chance';
import { CastMemberFakeBuilder } from '../cast-member-fake.builder';
import { CastMember, CastMemberId } from '../cast-member.aggregate';
import { CastMemberType } from '../cast-member-type.vo';

describe('CastMemberFakeBuilder Unit Tests', () => {
  describe('castMemberId()', () => {
    it('should throw an error if a factory is not provided', () => {
      expect(() => CastMemberFakeBuilder.aCastMember().castMemberId).toThrow(
        new Error(
          'Property castMemberId does not have a factory. Use withCastMemberId() method to set a factory.',
        ),
      );
    });

    it('should return a CastMemberId', () => {
      const builder = CastMemberFakeBuilder.aCastMember().withCastMemberId(
        () => new CastMemberId(),
      );
      expect(builder.castMemberId).toBeInstanceOf(CastMemberId);
    });

    it('should return an ID given an index', () => {
      const builder = CastMemberFakeBuilder.aCastMember().withCastMemberId(
        (i) => `${i + 1}` as any,
      );
      expect(builder.castMemberId).toBe('1');
    });
  });

  describe('name()', () => {
    it('should return a fixed name', () => {
      const builder = CastMemberFakeBuilder.aCastMember().withName('name');
      expect(builder.name).toBe('name');
    });

    it('should return a name given an index', () => {
      const builder = CastMemberFakeBuilder.aCastMember().withName(
        (i) => `name ${i + 1}`,
      );
      expect(builder.name).toBe('name 1');
    });

    it('should return a random name if no factory is provided', () => {
      const chance = Chance();
      const chanceSpy = jest.spyOn(chance, 'word');
      const builder = CastMemberFakeBuilder.aCastMember();
      builder['chance'] = chance;
      expect(builder.name).toBeDefined();
      expect(chanceSpy).toHaveBeenCalled();
    });
  });

  describe('type()', () => {
    it('should return a fixed CastMemberType', () => {
      const type = new CastMemberType(1);
      const builder = CastMemberFakeBuilder.aCastMember().withType(type);
      expect(builder.type).toBe(type);
    });

    it('should return a CastMemberType given an index', () => {
      const builder = CastMemberFakeBuilder.aCastMember().withType((i) =>
        i % 2 === 0 ? new CastMemberType(1) : new CastMemberType(2),
      );
      expect(builder.type).toEqual(new CastMemberType(1));
    });

    it('should return a random CastMemberType if no factory is provided', () => {
      const chance = Chance();
      const chanceSpy = jest.spyOn(chance, 'pickone');
      const builder = CastMemberFakeBuilder.aCastMember();
      builder['chance'] = chance;
      expect(builder.type).toBeDefined();
      expect(chanceSpy).toHaveBeenCalled();
    });
  });

  describe('createdAt()', () => {
    it('should throw an error if a factory is not provided', () => {
      expect(() => CastMemberFakeBuilder.aCastMember().createdAt).toThrow(
        new Error(
          'Property createdAt does not have a factory. Use withCreatedAt() method to set a factory.',
        ),
      );
    });

    it('should return a Date', () => {
      const builder = CastMemberFakeBuilder.aCastMember().withCreatedAt(
        () => new Date(),
      );
      expect(builder.createdAt).toBeInstanceOf(Date);
    });

    it('should return a Date given an index', () => {
      const builder = CastMemberFakeBuilder.aCastMember().withCreatedAt(
        (i) => new Date(i + 1),
      );
      expect(builder.createdAt).toEqual(new Date(1));
    });
  });

  describe('aCastMember()', () => {
    it('should return a CastMemberFakeBuilder', () => {
      const builder = CastMemberFakeBuilder.aCastMember();
      expect(builder).toBeInstanceOf(CastMemberFakeBuilder);
    });
  });

  describe('someCastMembers()', () => {
    it('should return a CastMemberFakeBuilder', () => {
      const builder = CastMemberFakeBuilder.someCastMembers(2);
      expect(builder).toBeInstanceOf(CastMemberFakeBuilder);
    });
  });

  describe('withCastMemberId()', () => {
    it('should return a CastMemberFakeBuilder', () => {
      const builder = CastMemberFakeBuilder.aCastMember().withCastMemberId(
        () => new CastMemberId(),
      );
      expect(builder).toBeInstanceOf(CastMemberFakeBuilder);
    });

    it('should set castMemberId factory and generate a CastMemberId', () => {
      const builder = CastMemberFakeBuilder.aCastMember().withCastMemberId(
        () => new CastMemberId(),
      );
      const factory = builder['_castMemberId'] as any;
      expect(factory()).toBeInstanceOf(CastMemberId);
    });

    it('should set castMemberId to a given value', () => {
      const castMemberId = new CastMemberId();
      const builder =
        CastMemberFakeBuilder.aCastMember().withCastMemberId(castMemberId);
      expect(builder['_castMemberId']).toBe(castMemberId);
    });
  });

  describe('withName()', () => {
    it('should return a CastMemberFakeBuilder', () => {
      const builder = CastMemberFakeBuilder.aCastMember().withName(
        () => 'name',
      );
      expect(builder).toBeInstanceOf(CastMemberFakeBuilder);
    });

    it('should set name factory and generate a string', () => {
      const builder = CastMemberFakeBuilder.aCastMember().withName(
        () => 'name',
      );
      const factory = builder['_name'] as any;
      expect(factory()).toBe('name');
    });

    it('should set name to a given value', () => {
      const builder = CastMemberFakeBuilder.aCastMember().withName('name');
      expect(builder['_name']).toBe('name');
    });
  });

  describe('withType()', () => {
    it('should return a CastMemberFakeBuilder', () => {
      const builder = CastMemberFakeBuilder.aCastMember().withType(
        () => new CastMemberType(1),
      );
      expect(builder).toBeInstanceOf(CastMemberFakeBuilder);
    });

    it('should set type factory and generate a CastMemberType', () => {
      const builder = CastMemberFakeBuilder.aCastMember().withType(
        () => new CastMemberType(1),
      );
      const factory = builder['_type'] as any;
      expect(factory()).toEqual(new CastMemberType(1));
    });

    it('should set type to a given value', () => {
      const type = new CastMemberType(2);
      const builder = CastMemberFakeBuilder.aCastMember().withType(type);
      expect(builder['_type']).toBe(type);
    });
  });

  describe('withCreatedAt()', () => {
    it('should return a CastMemberFakeBuilder', () => {
      const builder = CastMemberFakeBuilder.aCastMember().withCreatedAt(
        () => new Date(),
      );
      expect(builder).toBeInstanceOf(CastMemberFakeBuilder);
    });

    it('should set createdAt factory and generate a Date', () => {
      const builder = CastMemberFakeBuilder.aCastMember().withCreatedAt(
        () => new Date(),
      );
      const factory = builder['_createdAt'] as any;
      expect(factory()).toBeInstanceOf(Date);
    });

    it('should set createdAt to a given value', () => {
      const date = new Date();
      const builder = CastMemberFakeBuilder.aCastMember().withCreatedAt(date);
      expect(builder['_createdAt']).toBe(date);
    });
  });

  describe('withInvalidNameTooLong()', () => {
    it('should return a CastMemberFakeBuilder', () => {
      const builder =
        CastMemberFakeBuilder.aCastMember().withInvalidNameTooLong();
      expect(builder).toBeInstanceOf(CastMemberFakeBuilder);
    });

    it('should set name factory and generate a name with 256 characters', () => {
      const builder =
        CastMemberFakeBuilder.aCastMember().withInvalidNameTooLong();
      const factory = builder['_name'] as any;
      expect(factory()).toHaveLength(256);
    });

    it('should set name to a given a value', () => {
      const builder =
        CastMemberFakeBuilder.aCastMember().withInvalidNameTooLong(
          'a'.repeat(256),
        );
      expect(builder['_name']).toHaveLength(256);
    });
  });

  describe('build()', () => {
    it('should return a CastMember', () => {
      const castMember = CastMemberFakeBuilder.aCastMember().build();
      expect(castMember).toBeInstanceOf(CastMember);
      expect(castMember.castMemberId).toBeInstanceOf(CastMemberId);
      expect(castMember.name).toBeDefined();
      expect(castMember.type).toBeDefined();
      expect(castMember.createdAt).toBeDefined();
    });

    it('should return a CastMember with a fixed CastMemberId', () => {
      const castMemberId = new CastMemberId();
      const castMember = CastMemberFakeBuilder.aCastMember()
        .withCastMemberId(() => castMemberId)
        .build();
      expect(castMember.castMemberId).toBe(castMemberId);
    });

    it('should return a CastMember with a fixed name', () => {
      const name = 'name';
      const castMember = CastMemberFakeBuilder.aCastMember()
        .withName(() => name)
        .build();
      expect(castMember.name).toBe(name);
    });

    it('should return a CastMember with a fixed type', () => {
      const type = new CastMemberType(1);
      const castMember = CastMemberFakeBuilder.aCastMember()
        .withType(() => type)
        .build();
      expect(castMember.type).toBe(type);
    });

    it('should return a CastMember with a fixed createdAt', () => {
      const createdAt = new Date();
      const castMember = CastMemberFakeBuilder.aCastMember()
        .withCreatedAt(() => createdAt)
        .build();
      expect(castMember.createdAt).toBe(createdAt);
    });

    it('should return many CastMembers', () => {
      const categories = CastMemberFakeBuilder.someCastMembers(2).build();
      expect(categories).toBeInstanceOf(Array);
      expect(categories.length).toBe(2);
      expect(categories[0]).toBeInstanceOf(CastMember);
      expect(categories[1]).toBeInstanceOf(CastMember);
    });
  });
});
