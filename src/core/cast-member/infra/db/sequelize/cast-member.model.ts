import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

export type CastMemberModelProps = {
  castMemberId: string;
  name: string;
  type: number;
  createdAt: Date;
};

@Table({ tableName: 'cast-members', timestamps: false })
export class CastMemberModel extends Model<CastMemberModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare castMemberId: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare name: string;

  @Column({ type: DataType.TINYINT, allowNull: false })
  declare type: number;

  @Column({ type: DataType.DATE(3), allowNull: false })
  declare createdAt: Date;
}
