import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CastMemberRepository } from '../../../../domain/cast-member.repository';
import { CastMemberSequelizeRepository } from '../../../../infra/db/sequelize/cast-member-sequelize.repository';
import { CastMemberModel } from '../../../../infra/db/sequelize/cast-member.model';
import { GetCastMemberUseCase } from '../get-cast-member.use-case';
import { CastMember } from '../../../../domain/cast-member.aggregate';

describe('GetCastMemberUseCase Integration Tests', () => {
  let useCase: GetCastMemberUseCase;
  let castMemberRepository: CastMemberRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    castMemberRepository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new GetCastMemberUseCase(castMemberRepository);
  });

  describe('execute()', () => {
    it('should return an existing castMember', async () => {
      const castMember = CastMember.fake().aCastMember().build();
      await castMemberRepository.insert(castMember);
      const output = await useCase.execute({
        id: castMember.castMemberId.id,
      });
      expect(output).toStrictEqual({
        id: castMember.castMemberId.id,
        name: castMember.name,
        type: castMember.type.type,
        createdAt: castMember.createdAt,
      });
    });
  });
});
