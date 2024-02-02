import { CAST_MEMBER_TYPES } from '@core/cast-member/domain/cast-member-type.vo';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';

type CreateCastMemberInputProps = {
  name: string;
  type: number;
};

export class CreateCastMemberInput {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsIn([CAST_MEMBER_TYPES.ACTOR, CAST_MEMBER_TYPES.DIRECTOR])
  @IsNumber()
  type!: number;

  constructor(props: CreateCastMemberInputProps) {
    if (!props) {
      return;
    }
    this.name = props.name;
    this.type = props.type;
  }
}

export class ValidateCreateCastMemberInput {
  static validate(input: CreateCastMemberInput) {
    return validateSync(input);
  }
}
