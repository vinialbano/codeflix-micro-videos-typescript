import {
  Entity,
  EntityValidationError,
  UniqueEntityID,
} from '#seedwork/domain';
import { CategoryValidator } from '../validators';

export type CategoryProperties = {
  name: string;
  description?: string | null;
  isActive?: boolean;
  createdAt?: Date;
};

export class Category extends Entity<Required<CategoryProperties>> {
  constructor(props: CategoryProperties, id?: UniqueEntityID) {
    const { id: _id, ..._props } = Category.validate(props, id);
    super(_props, _id);
  }

  get name(): string {
    return this._props.name;
  }

  get description(): string | null {
    return this._props.description;
  }

  get isActive(): boolean {
    return this._props.isActive;
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  update(name: string, description?: string | null): void {
    const props = Category.validate({ name, description });
    this._props.name = props.name;
    this._props.description = props.description;
  }

  static validate(
    props: CategoryProperties,
    id?: UniqueEntityID,
  ): Required<CategoryProperties> & { id?: UniqueEntityID } {
    const validator = new CategoryValidator();
    validator.validate(props, id);
    if (validator.errors) {
      throw new EntityValidationError(validator.errors);
    }
    return validator.validatedData as any;
  }

  activate(): void {
    this._props.isActive = true;
  }

  deactivate(): void {
    this._props.isActive = false;
  }
}
