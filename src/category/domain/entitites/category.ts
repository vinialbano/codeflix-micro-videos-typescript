import { Entity } from "../../../@seedwork/domain/entities/entity";
import { EntityValidationError } from "../../../@seedwork/domain/errors/validation-error";
import { UniqueEntityID } from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import { CategoryValidator } from "../validators/category.validator";

export type CategoryProperties = {
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
};

export class Category extends Entity<CategoryProperties> {
  constructor(props: CategoryProperties, id?: UniqueEntityID) {
    Category.validate(props);
    super(props, id);
    this._props.description = props.description ?? null;
    this._props.isActive = props.isActive ?? true;
    this._props.createdAt = props.createdAt ?? new Date();
  }

  get name(): string {
    return this._props.name;
  }

  get description(): string {
    return this._props.description;
  }

  get isActive(): boolean {
    return this._props.isActive;
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  update(name: string, description: string): void {
    Category.validate({ name, description });
    this._props.name = name;
    this._props.description = description;
  }

  static validate(props: CategoryProperties): void {
    const validator = new CategoryValidator();
    validator.validate(props);
    if (validator.errors) {
      throw new EntityValidationError(validator.errors);
    }
  }

  activate(): void {
    this._props.isActive = true;
  }

  deactivate(): void {
    this._props.isActive = false;
  }
}
