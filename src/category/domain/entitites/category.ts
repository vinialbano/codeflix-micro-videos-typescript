import { Entity } from "../../../@seedwork/domain/entity/entity";
import { UniqueEntityID } from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";

export type CategoryProperties = {
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
};

export class Category extends Entity<CategoryProperties> {
  constructor(props: CategoryProperties, id?: UniqueEntityID) {
    super(props, id);
    this.props.description = props.description ?? null;
    this.props.isActive = props.isActive ?? true;
    this.props.createdAt = props.createdAt ?? new Date();
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  update(name: string, description: string): void {
    this.props.name = name;
    this.props.description = description;
  }

  activate(): void {
    this.props.isActive = true;
  }

  deactivate(): void {
    this.props.isActive = false;
  }
}
