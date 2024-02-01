import { DataType } from 'sequelize-typescript';
import { CastMemberModel } from '../cast-member.model';
import { CastMember } from '../../../../domain/cast-member.aggregate';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';

describe('CastMemberModel Integration Tests', () => {
  setupSequelize({
    models: [CastMemberModel],
  });

  it('should map the properties correctly', () => {
    const attributesMap = CastMemberModel.getAttributes();
    const attributes = Object.keys(attributesMap);

    expect(attributes).toStrictEqual([
      'castMemberId',
      'name',
      'type',
      'createdAt',
    ]);
    expect(attributesMap.castMemberId).toMatchObject({
      field: 'castMemberId',
      fieldName: 'castMemberId',
      primaryKey: true,
      type: DataType.UUID(),
    });
    expect(attributesMap.name).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255),
    });
    expect(attributesMap.type).toMatchObject({
      field: 'type',
      fieldName: 'type',
      allowNull: true,
      type: DataType.TINYINT(),
    });
    expect(attributesMap.createdAt).toMatchObject({
      field: 'createdAt',
      fieldName: 'createdAt',
      allowNull: false,
      type: DataType.DATE(3),
    });
  });

  it('should create a castMember', async () => {
    const castMember = CastMember.fake().aCastMember().build();

    const castMemberModel = await CastMemberModel.create({
      castMemberId: castMember.castMemberId.id,
      name: castMember.name,
      type: castMember.type.type,
      createdAt: castMember.createdAt,
    });

    expect(castMemberModel.toJSON()).toStrictEqual(castMember.toJSON());
  });
});
