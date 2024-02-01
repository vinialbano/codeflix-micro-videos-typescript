import {
  CastMember,
  CastMemberId,
} from '../../../../domain/cast-member.aggregate';
import { CastMemberSequelizeRepository } from '../cast-member-sequelize.repository';
import { CastMemberModel } from '../cast-member.model';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { CastMemberModelMapper } from '../cast-member-model.mapper';
import {
  CastMemberSearchParams,
  CastMemberSearchResult,
} from '../../../../domain/cast-member.repository';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CastMemberType } from '../../../../domain/cast-member-type.vo';

describe('CastMemberSequelizeRepository Integration Tests', () => {
  setupSequelize({
    models: [CastMemberModel],
  });

  let repository: CastMemberSequelizeRepository;
  beforeEach(async () => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
  });

  describe('insert()', () => {
    it('should insert a castMember', async () => {
      const castMember = CastMember.fake().aCastMember().build();

      await repository.insert(castMember);
      const model = await CastMemberModel.findByPk(castMember.castMemberId.id);
      expect(model?.toJSON()).toMatchObject(castMember.toJSON());
    });
  });

  describe('insertMany()', () => {
    it('should insert many castMembers', async () => {
      const castMembers = CastMember.fake().someCastMembers(3).build();

      await repository.insertMany(castMembers);
      const models = await CastMemberModel.findAll();
      expect(models.length).toBe(3);
      for (let i = 0; i < models.length; i++) {
        expect(models[i]!.toJSON()).toMatchObject(castMembers[i]!.toJSON());
      }
    });
  });

  describe('update()', () => {
    it('should throw an error if the castMember does not exist', async () => {
      const castMember = CastMember.fake().aCastMember().build();
      await expect(repository.update(castMember)).rejects.toThrow(
        new NotFoundError(castMember.castMemberId.id, CastMember),
      );
    });

    it('should update a castMember', async () => {
      const castMember = CastMember.fake().aCastMember().build();
      await repository.insert(castMember);

      castMember.changeName('New Name');
      castMember.changeType(new CastMemberType(2));

      await repository.update(castMember);
      const model = await CastMemberModel.findByPk(castMember.castMemberId.id);
      expect(model?.toJSON()).toMatchObject(castMember.toJSON());
    });
  });

  describe('delete()', () => {
    it('should throw an error if the castMember does not exist', async () => {
      const id = new CastMemberId();
      await expect(repository.delete(id)).rejects.toThrow(
        new NotFoundError(id, CastMember),
      );
    });

    it('should delete a castMember', async () => {
      const castMember = CastMember.fake().aCastMember().build();
      await repository.insert(castMember);

      await repository.delete(castMember.castMemberId);
      const model = await CastMemberModel.findByPk(castMember.castMemberId.id);
      expect(model).toBeNull();
    });
  });

  describe('findById()', () => {
    it('should find a castMember by id', async () => {
      const castMember = CastMember.fake().aCastMember().build();
      await repository.insert(castMember);

      const found = await repository.findById(castMember.castMemberId);
      expect(found?.toJSON()).toMatchObject(castMember.toJSON());
    });
  });

  describe('findAll()', () => {
    it('should find all castMembers', async () => {
      const castMembers = CastMember.fake().someCastMembers(3).build();
      await CastMemberModel.bulkCreate(castMembers.map((c) => c.toJSON()));

      const found = await repository.findAll();
      expect(found.length).toBe(3);
      for (let i = 0; i < found.length; i++) {
        expect(found[i]!.toJSON()).toMatchObject(castMembers[i]!.toJSON());
      }
    });
  });

  describe('search()', () => {
    it('should only paginate when other params are not provided', async () => {
      const createdAt = new Date();
      const castMembers = CastMember.fake()
        .someCastMembers(16)
        .withCreatedAt(createdAt)
        .build();
      await CastMemberModel.bulkCreate(castMembers.map((c) => c.toJSON()));
      const toEntitySpy = jest.spyOn(CastMemberModelMapper, 'toEntity');

      const searchOutput = await repository.search(
        new CastMemberSearchParams(),
      );
      expect(searchOutput).toBeInstanceOf(CastMemberSearchResult);
      expect(toEntitySpy).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        currentPage: 1,
        lastPage: 2,
        limit: 15,
      });
      expect(searchOutput.items.length).toBe(15);
      searchOutput.items.forEach((item, index) => {
        expect(item).toBeInstanceOf(CastMember);
        expect(item.toJSON()).toMatchObject(castMembers[index]!.toJSON());
      });
    });

    it('should order by createdAt desc when no sort is provided', async () => {
      const createdAt = new Date();
      const castMembers = CastMember.fake()
        .someCastMembers(16)
        .withCreatedAt((i) => new Date(createdAt.getTime() + i * 1000))
        .build();
      await CastMemberModel.bulkCreate(castMembers.map((c) => c.toJSON()));

      const searchOutput = await repository.search(
        new CastMemberSearchParams(),
      );
      const items = searchOutput.items;
      [...items].reverse().forEach((item, index) => {
        expect(item.toJSON()).toMatchObject(castMembers[index + 1]!.toJSON());
      });
    });

    it('should apply paginate and filter', async () => {
      const castMembers = [
        ...CastMember.fake()
          .someCastMembers(2)
          .withName((i) => `Test ${i}`)
          .withCreatedAt(
            (i) => new Date(new Date().getTime() + 4000 - i * 1000),
          )
          .build(),
        ...CastMember.fake()
          .someCastMembers(3)
          .withName((i) => `CastMember ${i}`)
          .withCreatedAt(
            (i) => new Date(new Date().getTime() + 5000 - i * 1000),
          )
          .build(),
      ];
      await CastMemberModel.bulkCreate(castMembers.map((c) => c.toJSON()));

      const searchOutput = await repository.search(
        new CastMemberSearchParams({
          page: 1,
          limit: 2,
          filter: 'CastMember',
        }),
      );
      expect(searchOutput).toBeInstanceOf(CastMemberSearchResult);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 3,
        currentPage: 1,
        lastPage: 2,
        limit: 2,
      });
      expect(searchOutput.items.length).toBe(2);
      expect(searchOutput.items[0]!.toJSON()).toMatchObject(
        castMembers[2]!.toJSON(),
      );
      expect(searchOutput.items[1]!.toJSON()).toMatchObject(
        castMembers[3]!.toJSON(),
      );
    });

    it('should apply paginate and sort', async () => {
      expect(repository.sortableFields).toStrictEqual([
        'name',
        'type',
        'createdAt',
      ]);
      const createdAt = new Date();
      const castMembers = [
        CastMember.fake()
          .aCastMember()
          .withName('B')
          .withCreatedAt(new Date(createdAt.getTime()))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName('A')
          .withCreatedAt(new Date(createdAt.getTime() + 1000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName('C')
          .withCreatedAt(new Date(createdAt.getTime() + 2000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName('E')
          .withCreatedAt(new Date(createdAt.getTime() + 3000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName('D')
          .withCreatedAt(new Date(createdAt.getTime() + 4000))
          .build(),
      ];
      await CastMemberModel.bulkCreate(castMembers.map((c) => c.toJSON()));

      const arrange = [
        {
          params: new CastMemberSearchParams({
            page: 1,
            limit: 2,
            sortCriteria: { field: 'name' },
          }),
          expected: [castMembers[1]!.toJSON(), castMembers[0]!.toJSON()],
        },
        {
          params: new CastMemberSearchParams({
            page: 1,
            limit: 2,
            sortCriteria: { field: 'name', direction: 'desc' },
          }),
          expected: [castMembers[3]!.toJSON(), castMembers[4]!.toJSON()],
        },
        {
          params: new CastMemberSearchParams({
            page: 1,
            limit: 2,
            sortCriteria: { field: 'createdAt' },
          }),
          expected: [castMembers[0]!.toJSON(), castMembers[1]!.toJSON()],
        },
        {
          params: new CastMemberSearchParams({
            page: 1,
            limit: 2,
            sortCriteria: { field: 'createdAt', direction: 'desc' },
          }),
          expected: [castMembers[4]!.toJSON(), castMembers[3]!.toJSON()],
        },
        {
          params: new CastMemberSearchParams({
            page: 1,
            limit: 2,
            sortCriteria: { field: 'invalidField' as any },
          }),
          // Sort by createdAt desc by default
          expected: [castMembers[4]!.toJSON(), castMembers[3]!.toJSON()],
        },
      ];

      for (const { params, expected } of arrange) {
        const searchOutput = await repository.search(params);
        expect(searchOutput).toBeInstanceOf(CastMemberSearchResult);
        expect(searchOutput.toJSON()).toMatchObject({
          total: 5,
          currentPage: 1,
          lastPage: 3,
          limit: 2,
        });
        expect(searchOutput.items.length).toBe(2);
        expect(searchOutput.items[0]!.toJSON()).toMatchObject(expected[0]!);
        expect(searchOutput.items[1]!.toJSON()).toMatchObject(expected[1]!);
      }
    });

    it('should apply paginate, filter and sort', async () => {
      const castMembers = [
        ...CastMember.fake()
          .someCastMembers(2)
          .withName((i) => `Test ${i}`)
          .withCreatedAt(
            (i) => new Date(new Date().getTime() + 4000 - i * 1000),
          )
          .build(),
        ...CastMember.fake()
          .someCastMembers(3)
          .withName((i) => `CastMember ${i}`)
          .withCreatedAt(
            (i) => new Date(new Date().getTime() + 5000 - i * 1000),
          )
          .build(),
      ];
      await CastMemberModel.bulkCreate(castMembers.map((c) => c.toJSON()));

      const searchOutput = await repository.search(
        new CastMemberSearchParams({
          page: 1,
          limit: 2,
          filter: 'CastMember',
          sortCriteria: { field: 'name', direction: 'desc' },
        }),
      );
      expect(searchOutput).toBeInstanceOf(CastMemberSearchResult);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 3,
        currentPage: 1,
        lastPage: 2,
        limit: 2,
      });
      expect(searchOutput.items.length).toBe(2);
      expect(searchOutput.items[0]!.toJSON()).toMatchObject(
        castMembers[4]!.toJSON(),
      );
      expect(searchOutput.items[1]!.toJSON()).toMatchObject(
        castMembers[3]!.toJSON(),
      );
    });

    it('should apply paginate, filter and sort by multiple fields', async () => {
      const castMembers = [
        ...CastMember.fake()
          .someCastMembers(2)
          .withName('CastMember A')
          .withCreatedAt((i) => new Date(new Date().getTime() + i * 1000))
          .build(),
        ...CastMember.fake()
          .someCastMembers(3)
          .withName('CastMember B')
          .withCreatedAt((i) => new Date(new Date().getTime() + i * 1000))
          .build(),
        CastMember.fake().aCastMember().withName('C').build(),
      ];
      await CastMemberModel.bulkCreate(castMembers.map((c) => c.toJSON()));

      const searchOutput = await repository.search(
        new CastMemberSearchParams({
          page: 1,
          limit: 3,
          filter: 'CastMember',
          sortCriteria: [
            { field: 'name', direction: 'desc' },
            { field: 'createdAt', direction: 'desc' },
          ],
        }),
      );
      expect(searchOutput).toBeInstanceOf(CastMemberSearchResult);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 5,
        currentPage: 1,
        lastPage: 2,
        limit: 3,
      });
      expect(searchOutput.items.length).toBe(3);
      expect(searchOutput.items[0]!.toJSON()).toMatchObject(
        castMembers[4]!.toJSON(),
      );
      expect(searchOutput.items[1]!.toJSON()).toMatchObject(
        castMembers[3]!.toJSON(),
      );
      expect(searchOutput.items[2]!.toJSON()).toMatchObject(
        castMembers[2]!.toJSON(),
      );
    });
  });
});
