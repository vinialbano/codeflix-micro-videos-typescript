import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from "class-validator";

type UpdateCategoryInputProps = {
  id: string
  name?: string;
  description?: string | null;
  isActive?: boolean;
};

export class UpdateCategoryInput {
  @IsString()
  @IsNotEmpty()
  id!: string;
  
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  constructor(props: UpdateCategoryInputProps) {
    if (!props) {
      return;
    }
    this.id = props.id;
    if ("name" in props) {
      this.name = props.name;
    }
    if ("description" in props) {
      this.description = props.description;
    }
    if ("isActive" in props) {
      this.isActive = props.isActive;
    }
  }
}

export class ValidateUpdateCategoryInput {
  static validate(input: UpdateCategoryInput) {
    return validateSync(input);
  }
}
