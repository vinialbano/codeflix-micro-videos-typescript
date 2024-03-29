import { UUID } from '../../shared/domain/value-objects/uuid.vo';
import { CategoryValidatorFactory } from './category.validator';
import { includeIfDefined } from '../../shared/utils';
import { CategoryFakeBuilder } from './category-fake.builder';
import { AggregateRoot } from '@core/shared/domain/aggregate-root';

export type CategoryConstructorProps = {
  categoryId?: CategoryId;
  name: string;
  description?: string | null;
  isActive?: boolean;
  createdAt?: Date;
};

export type CategoryCreateCommandProps = {
  categoryId?: CategoryId;
  name: string;
  description?: string | null;
  isActive?: boolean;
};

export class CategoryId extends UUID {}

export class Category extends AggregateRoot {
  categoryId: CategoryId;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;

  constructor(props: CategoryConstructorProps) {
    super();
    this.categoryId = props.categoryId ?? new CategoryId();
    this.name = props.name;
    this.description = props.description ?? null;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt ?? new Date();
  }

  static create(props: CategoryCreateCommandProps) {
    const category = new Category({
      name: props.name,
      ...includeIfDefined(props.categoryId, 'categoryId'),
      ...includeIfDefined(props.description, 'description'),
      ...includeIfDefined(props.isActive, 'isActive'),
    });
    category.validate(['name']);

    return category;
  }

  validate(fields?: string[]) {
    const validator = CategoryValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  get entityId() {
    return this.categoryId;
  }

  changeName(name: string) {
    this.name = name;
    this.validate(['name']);
  }

  changeDescription(description: string | null) {
    this.description = description;
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

  static fake() {
    return CategoryFakeBuilder;
  }
}
