import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { InvalidUUIDError } from '../../../../../shared/domain/value-objects/uuid.vo';
import { CastMember } from '../../../../domain/cast-member.aggregate';
import { CastMemberRepository } from '../../../../domain/cast-member.repository';
import { CastMemberInMemoryRepository } from '../../../../infra/db/in-memory/cast-member-in-memory.repository';
import { DeleteCastMemberUseCase } from '../delete-cast-member.use-case';

describe('DeleteCastMemberUseCase Unit Tests', () => {
  let useCase: DeleteCastMemberUseCase;
  let castMemberRepository: CastMemberRepository;

  beforeEach(() => {
    castMemberRepository = new CastMemberInMemoryRepository();
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
      const input = { id: 'f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e' };
      await expect(useCase.execute(input)).rejects.toThrow(
        new NotFoundError(input.id, CastMember),
      );
    });

    it('should delete an existing castMember', async () => {
      const castMember = CastMember.fake().aCastMember().build();
      await castMemberRepository.insert(castMember);
      const deleteSpy = jest.spyOn(castMemberRepository, 'delete');
      const output = await useCase.execute({
        id: castMember.castMemberId.id,
      });
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(output).toBeUndefined();
    });
  });
});
