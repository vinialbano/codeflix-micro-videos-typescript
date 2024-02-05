import { IsInt, IsNotEmpty, IsString, validateSync } from 'class-validator';

type CreateCastMemberInputProps = {
  name: string;
  type: number;
};

export class CreateCastMemberInput {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsInt()
  @IsNotEmpty()
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
