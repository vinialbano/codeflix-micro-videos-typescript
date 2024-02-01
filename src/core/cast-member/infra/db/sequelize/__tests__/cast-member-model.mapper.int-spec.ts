import { CastMemberModel } from '../cast-member.model';
import { CastMemberModelMapper } from '../cast-member-model.mapper';
import { EntityValidationError } from '../../../../../shared/domain/errors/validation.error';
import { CastMember } from '../../../../domain/cast-member.aggregate';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';

describe('CastMemberModelMapper Integration Tests', () => {
  setupSequelize({
    models: [CastMemberModel],
  });

  describe('toModel()', () => {
    it('should return a valid model', () => {
      const entity = CastMember.fake().aCastMember().build();
      const model = CastMemberModelMapper.toModel(entity);
      expect(model).toMatchObject(entity.toJSON());
    });
  });

  describe('toEntity()', () => {
    it('should throw an error if the model is invalid', async () => {
      const model = CastMemberModel.build({
        castMemberId: 'f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e',
        name: 'a'.repeat(256),
        type: 1,
      } as any);
      expect.assertions(2);
      try {
        CastMemberModelMapper.toEntity(model);
        fail('should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(EntityValidationError);
        expect((error as EntityValidationError).errors).toMatchObject([
          {
            name: ['name must be shorter than or equal to 255 characters'],
          },
        ]);
      }
    });

    it('should return a valid entity', () => {
      const entity = CastMember.fake().aCastMember().build();
      const model = CastMemberModel.build(entity.toJSON());
      const convertedEntity = CastMemberModelMapper.toEntity(model);
      expect(convertedEntity).toMatchObject(entity);
    });
  });
});
