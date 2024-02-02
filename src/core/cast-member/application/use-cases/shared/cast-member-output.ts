import { CastMember } from '../../../domain/cast-member.aggregate';

export type CastMemberOutput = {
  id: string;
  name: string;
  type: number;
  createdAt: Date;
};

export class CastMemberOutputMapper {
  static toDTO(castMember: CastMember): CastMemberOutput {
    const { castMemberId, ...castMemberProps } = castMember.toJSON();
    return {
      id: castMemberId,
      ...castMemberProps,
    };
  }
}
