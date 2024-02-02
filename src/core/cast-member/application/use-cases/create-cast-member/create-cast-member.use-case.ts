import { CastMemberType } from '../../../domain/cast-member-type.vo';
import { UseCase } from '../../../../shared/application/use-case';
import { EntityValidationError } from '../../../../shared/domain/errors/validation.error';
import { CastMember } from '../../../domain/cast-member.aggregate';
import { CastMemberRepository } from '../../../domain/cast-member.repository';
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from '../shared/cast-member-output';
import { CreateCastMemberInput } from './create-cast-member.input';

export class CreateCastMemberUseCase
  implements UseCase<CreateCastMemberInput, CreateCastMemberOutput>
{
  constructor(private readonly castMemberRepository: CastMemberRepository) {}

  async execute(input: CreateCastMemberInput): Promise<CreateCastMemberOutput> {
    const castMember = CastMember.create({
      name: input.name,
      type: new CastMemberType(input.type),
    });
    if (castMember.notification.hasErrors()) {
      throw new EntityValidationError(castMember.notification.toJSON());
    }
    await this.castMemberRepository.insert(castMember);
    return CastMemberOutputMapper.toDTO(castMember);
  }
}

export type CreateCastMemberOutput = CastMemberOutput;
