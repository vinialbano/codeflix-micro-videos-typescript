import { SortDirection } from '../../../../../shared/domain/repository/search-params';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CastMember } from '../../../../domain/cast-member.aggregate';
import { CastMemberRepository } from '../../../../domain/cast-member.repository';
import { CastMemberSequelizeRepository } from '../../../../infra/db/sequelize/cast-member-sequelize.repository';
import { CastMemberModel } from '../../../../infra/db/sequelize/cast-member.model';
import { ListCastMembersUseCase } from '../list-cast-members.use-case';
import { CastMemberOutputMapper } from '../../shared/cast-member-output';

describe('ListCastMembersUseCase Integration Tests', () => {
  let useCase: ListCastMembersUseCase;
  let castMemberRepository: CastMemberRepository;
  const castMembers = CastMember.fake()
    .someCastMembers(5)
    .withName((i) => `CastMember ${i % 2 === 0 ? 'A' : 'B'}${i}`)
    .withCreatedAt((i) => new Date(new Date().getTime() + i * 1000))
    .build();

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(async () => {
    castMemberRepository = new CastMemberSequelizeRepository(CastMemberModel);
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
          sort: 'name',
          sortDirection: 'desc' as SortDirection,
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
          filter: 'CastMember B',
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
