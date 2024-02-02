import { InvalidUUIDError } from '../../../../../shared/domain/value-objects/uuid.vo';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CastMemberRepository } from '../../../../domain/cast-member.repository';
import { CastMemberSequelizeRepository } from '../../../../infra/db/sequelize/cast-member-sequelize.repository';
import { CastMemberModel } from '../../../../infra/db/sequelize/cast-member.model';
import { DeleteCastMemberUseCase } from '../delete-cast-member.use-case';
import {
  CastMember,
  CastMemberId,
} from '../../../../domain/cast-member.aggregate';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';

describe('DeleteCastMemberUseCase Integration Tests', () => {
  let useCase: DeleteCastMemberUseCase;
  let castMemberRepository: CastMemberRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    castMemberRepository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new DeleteCastMemberUseCase(castMemberRepository);
  });

  describe('execute()', () => {
    it('should throw an error if uuid is invalid', async () => {
      const input = { id: 'invalid-uuid' };
      await expect(useCase.execute(input)).rejects.toThrow(
        new InvalidUUIDError(input.id),
      );
    });

    it('should throw an error if castMember does not exist', async () => {
      const input = { id: new CastMemberId().id };
      await expect(useCase.execute(input)).rejects.toThrow(
        new NotFoundError(input.id, CastMember),
      );
    });

    it('should delete an existing castMember', async () => {
      const castMember = CastMember.fake().aCastMember().build();
      await castMemberRepository.insert(castMember);
      await useCase.execute({
        id: castMember.castMemberId.id,
      });
      const entity = await castMemberRepository.findById(
        castMember.castMemberId,
      );
      expect(entity).toBeNull();
    });
  });
});
