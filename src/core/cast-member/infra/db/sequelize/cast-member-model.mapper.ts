import { CastMemberType } from '../../../domain/cast-member-type.vo';
import { EntityValidationError } from '../../../../shared/domain/errors/validation.error';
import {
  CastMember,
  CastMemberId,
} from '../../../domain/cast-member.aggregate';
import { CastMemberModel } from './cast-member.model';

export class CastMemberModelMapper {
  static toModel(entity: CastMember): CastMemberModel {
    return CastMemberModel.build({
      castMemberId: entity.castMemberId.id,
      name: entity.name,
      type: entity.type.type,
      createdAt: entity.createdAt,
    });
  }

  static toEntity(model: CastMemberModel): CastMember {
    const entity = new CastMember({
      castMemberId: new CastMemberId(model.castMemberId),
      name: model.name,
      type: new CastMemberType(model.type),
      createdAt: model.createdAt,
    });
    entity.validate();
    if (entity.notification.hasErrors()) {
      throw new EntityValidationError(entity.notification.toJSON());
    }
    return entity;
  }
}
