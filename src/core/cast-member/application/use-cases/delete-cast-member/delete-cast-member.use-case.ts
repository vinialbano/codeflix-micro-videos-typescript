import { CastMemberId } from '../../../domain/cast-member.aggregate';
import { UseCase } from '../../../../shared/application/use-case';
import { CastMemberRepository } from '../../../domain/cast-member.repository';

export class DeleteCastMemberUseCase
  implements UseCase<DeleteCastMemberInput, DeleteCastMemberOutput>
{
  constructor(private readonly castMemberRepository: CastMemberRepository) {}

  async execute(input: DeleteCastMemberInput): Promise<DeleteCastMemberOutput> {
    const id = new CastMemberId(input.id);
    await this.castMemberRepository.delete(id);
  }
}

export type DeleteCastMemberInput = {
  id: string;
};

export type DeleteCastMemberOutput = void;
