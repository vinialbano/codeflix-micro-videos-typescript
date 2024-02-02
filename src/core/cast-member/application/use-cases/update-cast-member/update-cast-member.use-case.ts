import { UseCase } from '../../../../shared/application/use-case';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { EntityValidationError } from '../../../../shared/domain/errors/validation.error';
import {
  CastMember,
  CastMemberId,
} from '../../../domain/cast-member.aggregate';
import { CastMemberRepository } from '../../../domain/cast-member.repository';
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from '../shared/cast-member-output';
import { UpdateCastMemberInput } from './update-cast-member.input';
import { CastMemberType } from '../../../domain/cast-member-type.vo';

export class UpdateCastMemberUseCase
  implements UseCase<UpdateCastMemberInput, UpdateCastMemberOutput>
{
  constructor(private readonly castMemberRepository: CastMemberRepository) {}

  async execute(input: UpdateCastMemberInput): Promise<UpdateCastMemberOutput> {
    const id = new CastMemberId(input.id);
    const castMember = await this.castMemberRepository.findById(id);
    if (!castMember) {
      throw new NotFoundError(input.id, CastMember);
    }
    if ('name' in input) {
      castMember.changeName(input.name);
    }
    if ('type' in input) {
      castMember.changeType(new CastMemberType(input.type));
    }
    if (castMember.notification.hasErrors()) {
      throw new EntityValidationError(castMember.notification.toJSON());
    }
    await this.castMemberRepository.update(castMember);
    return CastMemberOutputMapper.toDTO(castMember);
  }
}

export type UpdateCastMemberOutput = CastMemberOutput;
