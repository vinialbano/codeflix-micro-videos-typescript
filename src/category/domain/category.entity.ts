import { EntityValidationError } from "../../shared/domain/errors/validation.error";
import { UUID } from "../../shared/domain/value-objects/uuid.vo";
import { CategoryValidatorFactory } from "./category.validator";
import { includeIfDefined } from "../../shared/utils";
import { Entity } from "../../shared/domain/entity";

export type CategoryConstructorProps = {
  categoryId?: UUID;
  name: string;
  description?: string | null;
  isActive?: boolean;
  createdAt?: Date;
};

export type CategoryCreateCommandProps = {
  categoryId?: UUID;
  name: string;
  description?: string | null;
  isActive?: boolean;
};

export class Category extends Entity {
  categoryId: UUID;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;

  constructor(props: CategoryConstructorProps) {
    super();
    this.categoryId = props.categoryId ?? new UUID();
    this.name = props.name;
    this.description = props.description ?? null;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt ?? new Date();
  }

  static create(props: CategoryCreateCommandProps) {
    const category = new Category({
      name: props.name,
      ...includeIfDefined(props.categoryId, "categoryId"),
      ...includeIfDefined(props.description, "description"),
      ...includeIfDefined(props.isActive, "isActive"),
    });
    Category.validate(category);

    return category;
  }

  static validate(entity: Category) {
    const validator = CategoryValidatorFactory.create();
    const isValid = validator.validate(entity);
    if (!isValid) {
      throw new EntityValidationError(validator.errors!);
    }
  }

  get entityId() {
    return this.categoryId;
  }

  changeName(name: string) {
    this.name = name;
    Category.validate(this);
  }

  changeDescription(description: string | null) {
    this.description = description;
    Category.validate(this);
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }

  toJSON() {
    return {
      categoryId: this.categoryId.id,
      name: this.name,
      description: this.description,
      isActive: this.isActive,
      createdAt: this.createdAt,
    };
  }
}
