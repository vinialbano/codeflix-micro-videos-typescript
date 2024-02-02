import { UseCase } from '../../../../shared/application/use-case';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import {
  CastMember,
  CastMemberId,
} from '../../../domain/cast-member.aggregate';
import { CastMemberRepository } from '../../../domain/cast-member.repository';
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from '../shared/cast-member-output';

export class GetCastMemberUseCase
  implements UseCase<GetCastMemberInput, GetCastMemberOutput>
{
  constructor(private readonly castMemberRepository: CastMemberRepository) {}

  async execute(input: GetCastMemberInput): Promise<GetCastMemberOutput> {
    const id = new CastMemberId(input.id);
    const castMember = await this.castMemberRepository.findById(id);
    if (!castMember) {
      throw new NotFoundError(input.id, CastMember);
    }
    return CastMemberOutputMapper.toDTO(castMember);
  }
}

export type GetCastMemberInput = {
  id: string;
};

export type GetCastMemberOutput = CastMemberOutput;
