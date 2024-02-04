import { SortDirection } from '../../../../../shared/domain/repository/search-params';
import { CastMember } from '../../../../domain/cast-member.aggregate';
import { CastMemberRepository } from '../../../../domain/cast-member.repository';
import { CastMemberInMemoryRepository } from '../../../../infra/db/in-memory/cast-member-in-memory.repository';
import { ListCastMembersUseCase } from '../list-cast-members.use-case';
import { CastMemberOutputMapper } from '../../shared/cast-member-output';
import {
  CAST_MEMBER_TYPES,
  CastMemberType,
} from '../../../../domain/cast-member-type.vo';

describe('ListCastMembersUseCase Unit Tests', () => {
  let useCase: ListCastMembersUseCase;
  let castMemberRepository: CastMemberRepository;
  const castMembers = CastMember.fake()
    .someCastMembers(5)
    .withName((i) => `CastMember ${i % 2 === 0 ? 'A' : 'B'}`)
    .withCreatedAt((i) => new Date(new Date().getTime() + i * 1000))
    .withType(
      (i) =>
        new CastMemberType(
          i % 2 === 0 ? CAST_MEMBER_TYPES.ACTOR : CAST_MEMBER_TYPES.DIRECTOR,
        ),
    )
    .build();

  beforeEach(async () => {
    castMemberRepository = new CastMemberInMemoryRepository();
    useCase = new ListCastMembersUseCase(castMemberRepository);
    await castMemberRepository.insertMany(castMembers);
  });

  describe('execute()', () => {
    const assertions = [
      {
        given: {},
        expected: {
          items: [...castMembers]
            .reverse()
            .map((c) => CastMemberOutputMapper.toDTO(c)),
          total: 5,
          currentPage: 1,
          lastPage: 1,
          limit: 15,
        },
      },
      {
        given: {
          page: 2,
          limit: 2,
        },
        expected: {
          items: [castMembers[2], castMembers[1]].map((c) =>
            CastMemberOutputMapper.toDTO(c!),
          ),
          total: 5,
          currentPage: 2,
          lastPage: 3,
          limit: 2,
        },
      },
      {
        given: {
          sortCriteria: {
            field: 'name' as keyof CastMember,
            direction: 'desc' as SortDirection,
          },
        },
        expected: {
          items: [
            castMembers[1],
            castMembers[3],
            castMembers[0],
            castMembers[2],
            castMembers[4],
          ].map((c) => CastMemberOutputMapper.toDTO(c!)),
          total: 5,
          currentPage: 1,
          lastPage: 1,
          limit: 15,
        },
      },
      {
        given: {
          sortCriteria: [
            {
              field: 'name' as keyof CastMember,
              direction: 'desc' as SortDirection,
            },
            {
              field: 'createdAt' as keyof CastMember,
              direction: 'desc' as SortDirection,
            },
          ],
        },
        expected: {
          items: [
            castMembers[3],
            castMembers[1],
            castMembers[4],
            castMembers[2],
            castMembers[0],
          ].map((c) => CastMemberOutputMapper.toDTO(c!)),
          total: 5,
          currentPage: 1,
          lastPage: 1,
          limit: 15,
        },
      },
      {
        given: {
          filter: {
            name: 'CastMember B',
          },
        },
        expected: {
          items: [castMembers[3], castMembers[1]].map((c) =>
            CastMemberOutputMapper.toDTO(c!),
          ),
          total: 2,
          currentPage: 1,
          lastPage: 1,
          limit: 15,
        },
      },
      {
        given: {
          filter: {
            name: 'CastMember B',
          },
        },
        expected: {
          items: [castMembers[3], castMembers[1]].map((c) =>
            CastMemberOutputMapper.toDTO(c!),
          ),
          total: 2,
          currentPage: 1,
          lastPage: 1,
          limit: 15,
        },
      },
      {
        given: {
          filter: {
            name: 'CastMember B',
            type: new CastMemberType(CAST_MEMBER_TYPES.DIRECTOR),
          },
        },
        expected: {
          items: [castMembers[3], castMembers[1]].map((c) =>
            CastMemberOutputMapper.toDTO(c!),
          ),
          total: 2,
          currentPage: 1,
          lastPage: 1,
          limit: 15,
        },
      },
    ];
    it.each(assertions)(
      'should return a list of castMembers',
      async ({ given, expected }) => {
        const output = await useCase.execute(given);
        expect(output).toStrictEqual(expected);
      },
    );
  });
});
