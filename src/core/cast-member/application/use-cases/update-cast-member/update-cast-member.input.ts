import { CAST_MEMBER_TYPES } from '@core/cast-member/domain/cast-member-type.vo';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

type UpdateCastMemberInputProps = {
  id: string;
  name?: string;
  type?: number;
};

export class UpdateCastMemberInput {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsIn([CAST_MEMBER_TYPES.ACTOR, CAST_MEMBER_TYPES.DIRECTOR])
  @IsNumber()
  @IsOptional()
  type?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  constructor(props: UpdateCastMemberInputProps) {
    if (!props) {
      return;
    }
    this.id = props.id;
    if ('name' in props) {
      this.name = props.name;
    }
    if ('type' in props) {
      this.type = props.type;
    }
  }
}

export class ValidateUpdateCastMemberInput {
  static validate(input: UpdateCastMemberInput) {
    return validateSync(input);
  }
}
