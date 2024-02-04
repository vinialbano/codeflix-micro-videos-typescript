import {
  CAST_MEMBER_TYPES,
  CastMemberType,
} from '../../../domain/cast-member-type.vo';
import { CastMember } from '../../../domain/cast-member.aggregate';
import { CastMemberInMemoryRepository } from './cast-member-in-memory.repository';

describe('CastMemberInMemoryRepository', () => {
  describe('getEntity()', () => {
    it('should return CastMember', () => {
      const repository = new CastMemberInMemoryRepository();
      expect(repository.getEntity()).toEqual(CastMember);
    });
  });

  describe('applyFilter()', () => {
    it('should return all items if filter is null', async () => {
      const repository = new CastMemberInMemoryRepository();
      const items = CastMember.fake().someCastMembers(3).build();
      const filteredItems = await repository['applyFilter'](items, null);
      expect(filteredItems).toEqual(items);
    });

    it('should return filtered items by name', async () => {
      const repository = new CastMemberInMemoryRepository();
      const items = CastMember.fake()
        .someCastMembers(3)
        .withName((i) => `Name ${i + 1}`)
        .build();
      const filteredItems = await repository['applyFilter'](items, {
        name: '2',
      });
      expect(filteredItems).toEqual([items[1]]);
    });

    it('should return filtered items by type', async () => {
      const repository = new CastMemberInMemoryRepository();
      const items = CastMember.fake()
        .someCastMembers(3)
        .withName((i) => `Name ${i + 1}`)
        .withType(
          (i) =>
            new CastMemberType(
              i % 2 === 0
                ? CAST_MEMBER_TYPES.ACTOR
                : CAST_MEMBER_TYPES.DIRECTOR,
            ),
        )
        .build();
      const filteredItems = await repository['applyFilter'](items, {
        type: new CastMemberType(CAST_MEMBER_TYPES.DIRECTOR),
      });
      expect(filteredItems).toEqual([items[1]]);
    });

    it('should return filtered items by type and name', async () => {
      const repository = new CastMemberInMemoryRepository();
      const items = CastMember.fake()
        .someCastMembers(3)
        .withName((i) => `Name ${i + 1}`)
        .withType(
          (i) =>
            new CastMemberType(
              i % 2 === 0
                ? CAST_MEMBER_TYPES.ACTOR
                : CAST_MEMBER_TYPES.DIRECTOR,
            ),
        )
        .build();
      const filteredItems = await repository['applyFilter'](items, {
        name: '2',
        type: new CastMemberType(CAST_MEMBER_TYPES.DIRECTOR),
      });
      expect(filteredItems).toEqual([items[1]]);
    });
  });

  describe('applySort()', () => {
    it('should sort by createdAt desc if sortCriteria is not set', () => {
      const repository = new CastMemberInMemoryRepository();
      const date = new Date();
      const items = CastMember.fake()
        .someCastMembers(3)
        .withCreatedAt((i) => new Date(date.getTime() + i * 1000))
        .build();
      const sortedItems = repository['applySort'](items);
      expect(sortedItems).toEqual([items[2], items[1], items[0]]);
    });

    it('should sort using the given parameters', async () => {
      const repository = new CastMemberInMemoryRepository();
      const items = CastMember.fake()
        .someCastMembers(3)
        .withName((i) => `Name ${i + 1}`)
        .withType((i) =>
          i % 2 === 0
            ? new CastMemberType(CAST_MEMBER_TYPES.DIRECTOR)
            : new CastMemberType(CAST_MEMBER_TYPES.ACTOR),
        )
        .build();
      const sortedItems = repository['applySort'](items, {
        field: 'name',
        direction: 'desc',
      });
      expect(sortedItems).toEqual([items[2], items[1], items[0]]);

      const sortedItems2 = repository['applySort'](items, {
        field: 'name',
        direction: 'asc',
      });
      expect(sortedItems2).toEqual([items[0], items[1], items[2]]);

      const sortedItems3 = repository['applySort'](items, [
        { field: 'type', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ]);
      expect(sortedItems3).toEqual([items[0], items[2], items[1]]);
    });
  });
});
