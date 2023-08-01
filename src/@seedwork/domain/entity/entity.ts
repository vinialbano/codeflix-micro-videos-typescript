import { UniqueEntityID } from "../value-objects/unique-entity-id.vo";
import { ValueObject } from "../value-objects/value-object";

export abstract class Entity<Props extends object> {
  protected readonly _id: UniqueEntityID;
  protected readonly props: Props;

  constructor(props: Props, id?: UniqueEntityID) {
    this._id = id ?? new UniqueEntityID();
    this.props = props;
  }

  get id(): string {
    return this._id.value;
  }

  toJSON(): Required<{ id: string } & Props> {
    const getProps = (object: Props): any => {
      if (object instanceof ValueObject) {
        return object.toJSON();
      }
      if (Array.isArray(object)) {
        return object.map(getProps);
      }
      if (object instanceof Date) {
        return object;
      }
      if (typeof object === "object" && object !== null) {
        return Object.entries(object).reduce(
          (acc, [key, value]) => ({ ...acc, [key]: getProps(value) }),
          {}
        );
      }
      return object;
    };

    const props = getProps(this.props);
    return {
      id: this.id,
      ...props,
    };
  }
}
