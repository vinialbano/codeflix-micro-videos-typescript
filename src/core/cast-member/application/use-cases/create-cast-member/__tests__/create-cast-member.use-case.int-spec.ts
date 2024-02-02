import { CastMemberId } from '../../../../domain/cast-member.aggregate';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CastMemberRepository } from '../../../../domain/cast-member.repository';

import { CastMemberSequelizeRepository } from '../../../../infra/db/sequelize/cast-member-sequelize.repository';
import { CastMemberModel } from '../../../../infra/db/sequelize/cast-member.model';
import { CreateCastMemberUseCase } from '../create-cast-member.use-case';

describe('CreateCastMemberUseCase Integration Tests', () => {
  let useCase: CreateCastMemberUseCase;
  let castMemberRepository: CastMemberRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    castMemberRepository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new CreateCastMemberUseCase(castMemberRepository);
  });

  describe('execute()', () => {
    const inputs = [
      { name: 'George Lucas', type: 1 },
      { name: 'Johnny Depp', type: 2 },
    ];
    it.each(inputs)('should create a castMember', async (input) => {
      const output = await useCase.execute(input);
      const entity = await castMemberRepository.findById(
        new CastMemberId(output.id),
      );
      expect(output).toStrictEqual({
        id: entity!.castMemberId.id,
        name: entity!.name,
        type: entity!.type.type,
        createdAt: entity!.createdAt,
      });
    });
  });
});
