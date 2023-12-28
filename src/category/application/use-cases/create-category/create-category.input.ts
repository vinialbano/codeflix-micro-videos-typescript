import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from "class-validator";

type CreateCategoryInputProps = {
  name: string;
  description?: string | null;
  isActive?: boolean;
};

export class CreateCategoryInput {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  constructor(props: CreateCategoryInputProps) {
    if (!props) {
      return;
    }
    this.name = props.name;
    if ("description" in props) {
      this.description = props.description;
    }
    if ("isActive" in props) {
      this.isActive = props.isActive;
    }
  }
}

export class ValidateCreateCategoryInput {
  static validate(input: CreateCategoryInput) {
    return validateSync(input);
  }
}
