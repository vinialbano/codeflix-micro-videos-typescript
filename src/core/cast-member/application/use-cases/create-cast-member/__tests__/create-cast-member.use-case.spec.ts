import { InvalidCastMemberTypeError } from '../../../../domain/cast-member-type.vo';
import { EntityValidationError } from '../../../../../shared/domain/errors/validation.error';
import { CastMemberRepository } from '../../../../domain/cast-member.repository';
import { CastMemberInMemoryRepository } from '../../../../infra/db/in-memory/cast-member-in-memory.repository';
import { CreateCastMemberUseCase } from '../create-cast-member.use-case';

describe('CreateCastMemberUseCase Unit Tests', () => {
  let useCase: CreateCastMemberUseCase;
  let castMemberRepository: CastMemberRepository;

  beforeEach(() => {
    castMemberRepository = new CastMemberInMemoryRepository();
    useCase = new CreateCastMemberUseCase(castMemberRepository);
  });

  describe('execute()', () => {
    it('should throw if the entity is invalid', async () => {
      let input = {
        name: 'a'.repeat(256),
        type: 1,
      };
      await expect(() => useCase.execute(input)).rejects.toThrow(
        EntityValidationError,
      );

      input = {
        name: 'a',
        type: 0,
      };
      await expect(() => useCase.execute(input)).rejects.toThrow(
        InvalidCastMemberTypeError,
      );
    });

    const assertions = [
      {
        given: { name: 'George Lucas', type: 1 },
        expected: { name: 'George Lucas', type: 1 },
      },
      {
        given: { name: 'Johnny Depp', type: 2 },
        expected: {
          name: 'Johnny Depp',
          type: 2,
        },
      },
    ];
    it.each(assertions)(
      'should create a castMember',
      async ({ given, expected }) => {
        const insertSpy = jest.spyOn(castMemberRepository, 'insert');
        const output = await useCase.execute(given);

        expect(insertSpy).toHaveBeenCalledTimes(1);
        expect(output).toEqual({
          id: expect.any(String),
          name: expected.name,
          type: expected.type,
          createdAt: expect.any(Date),
        });
      },
    );
  });
});
