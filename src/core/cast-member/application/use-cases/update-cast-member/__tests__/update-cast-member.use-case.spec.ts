import {
  CAST_MEMBER_TYPES,
  InvalidCastMemberTypeError,
} from '../../../../domain/cast-member-type.vo';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { EntityValidationError } from '../../../../../shared/domain/errors/validation.error';
import { InvalidUUIDError } from '../../../../../shared/domain/value-objects/uuid.vo';
import {
  CastMember,
  CastMemberId,
} from '../../../../domain/cast-member.aggregate';
import { CastMemberRepository } from '../../../../domain/cast-member.repository';
import { CastMemberInMemoryRepository } from '../../../../infra/db/in-memory/cast-member-in-memory.repository';
import { UpdateCastMemberUseCase } from '../update-cast-member.use-case';

describe('UpdateCastMemberUseCase Unit Tests', () => {
  let useCase: UpdateCastMemberUseCase;
  let castMemberRepository: CastMemberRepository;

  beforeEach(() => {
    castMemberRepository = new CastMemberInMemoryRepository();
    useCase = new UpdateCastMemberUseCase(castMemberRepository);
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

    it('should throw if the type is invalid', async () => {
      const id = new CastMemberId();
      const input = {
        id: id.id,
        type: 0,
      };
      const castMember = CastMember.fake()
        .aCastMember()
        .withCastMemberId(id)
        .build();
      await castMemberRepository.insert(castMember);
      await expect(() => useCase.execute(input)).rejects.toThrow(
        InvalidCastMemberTypeError,
      );
    });

    it('should throw if the entity is invalid', async () => {
      const id = new CastMemberId();
      const input = {
        id: id.id,
        name: 'a'.repeat(256),
      };
      const castMember = CastMember.fake()
        .aCastMember()
        .withCastMemberId(id)
        .build();
      await castMemberRepository.insert(castMember);
      await expect(() => useCase.execute(input)).rejects.toThrow(
        EntityValidationError,
      );
    });

    const assertions = [
      {
        given: { name: 'Johnny Depp' },
        expected: { name: 'Johnny Depp' },
      },
      {
        given: { type: CAST_MEMBER_TYPES.ACTOR },
        expected: { type: CAST_MEMBER_TYPES.ACTOR },
      },
      {
        given: { type: CAST_MEMBER_TYPES.DIRECTOR },
        expected: { type: CAST_MEMBER_TYPES.DIRECTOR },
      },
      {
        given: { name: 'Johnny Depp', type: CAST_MEMBER_TYPES.ACTOR },
        expected: { name: 'Johnny Depp', type: CAST_MEMBER_TYPES.ACTOR },
      },
    ];
    it.each(assertions)(
      'should update an existing castMember',
      async ({ given, expected }) => {
        const castMember = CastMember.fake().aCastMember().build();
        await castMemberRepository.insert(castMember);
        const updateSpy = jest.spyOn(castMemberRepository, 'update');
        const output = await useCase.execute({
          id: castMember.castMemberId.id,
          ...given,
        });
        expect(updateSpy).toHaveBeenCalledTimes(1);
        expect(output).toStrictEqual({
          id: castMember.castMemberId.id,
          name: expected.name ?? castMember.name,
          type: expected.type ?? castMember.type.type,
          createdAt: castMember.createdAt,
        });
      },
    );
  });
});
