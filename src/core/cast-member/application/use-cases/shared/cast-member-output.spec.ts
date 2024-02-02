import { CastMember } from '../../../domain/cast-member.aggregate';
import { CastMemberOutputMapper } from './cast-member-output';

describe('CastMemberOutputMapper Unit Tests', () => {
  describe('toDTO()', () => {
    it('should map a castMember to a castMember output', () => {
      const castMember = CastMember.fake().aCastMember().build();
      const output = CastMemberOutputMapper.toDTO(castMember);
      expect(output).toStrictEqual({
        id: castMember.castMemberId.id,
        name: castMember.name,
        type: castMember.type.type,
        createdAt: castMember.createdAt,
      });
    });
  });
});
