import {
  IsBoolean,
  IsDate,
  IsInstance,
  IsNotEmpty,
  IsString,
  MaxLength,
} from "class-validator";
import { Category } from "./category.entity";
import { ClassValidatorFields } from "../../shared/domain/validators/class-validator-fields";
import { UUID } from "../../shared/domain/value-objects/uuid.vo";
import { IsNullable } from "../../shared/domain/validators/class-validator-custom-decorators";

class CategoryRules {
  @IsInstance(UUID)
  categoryId!: UUID;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNullable()
  description!: string | null;

  @IsBoolean()
  isActive!: boolean;

  @IsDate()
  createdAt!: Date;

  constructor(props: Category) {
    Object.assign(this, { ...props });
  }
}

export class CategoryValidator extends ClassValidatorFields<CategoryRules> {
  validate(entity: Category) {
    const rules = new CategoryRules(entity);
    return super.validate(rules);
  }
}

export class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator();
  }
}
