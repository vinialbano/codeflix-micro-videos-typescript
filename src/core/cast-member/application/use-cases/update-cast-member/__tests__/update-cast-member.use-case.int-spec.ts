import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CastMemberRepository } from '../../../../domain/cast-member.repository';
import { CastMemberSequelizeRepository } from '../../../../infra/db/sequelize/cast-member-sequelize.repository';
import { CastMemberModel } from '../../../../infra/db/sequelize/cast-member.model';
import { UpdateCastMemberUseCase } from '../update-cast-member.use-case';
import {
  CastMember,
  CastMemberId,
} from '../../../../domain/cast-member.aggregate';
import { CAST_MEMBER_TYPES } from '../../../../domain/cast-member-type.vo';

describe('UpdateCastMemberUseCase Integration Tests', () => {
  let useCase: UpdateCastMemberUseCase;
  let castMemberRepository: CastMemberRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    castMemberRepository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new UpdateCastMemberUseCase(castMemberRepository);
  });

  describe('execute()', () => {
    const inputs = [
      { name: 'George Lucas' },
      { type: CAST_MEMBER_TYPES.DIRECTOR },
      { type: CAST_MEMBER_TYPES.ACTOR },
      { name: 'George Lucas', type: CAST_MEMBER_TYPES.DIRECTOR },
      { name: 'Johnny Depp', type: CAST_MEMBER_TYPES.ACTOR },
    ];
    it.each(inputs)('should update an existing castMember', async (input) => {
      const castMember = CastMember.fake().aCastMember().build();
      await castMemberRepository.insert(castMember);
      const output = await useCase.execute({
        id: castMember.castMemberId.id,
        ...input,
      });
      const entity = await castMemberRepository.findById(
        new CastMemberId(output.id),
      );
      expect(output).toStrictEqual({
        id: entity!.castMemberId.id,
        name: input.name ?? entity!.name,
        type: input.type ?? entity!.type.type,
        createdAt: entity!.createdAt,
      });
    });
  });
});
