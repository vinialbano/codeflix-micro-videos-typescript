import { UniqueEntityID } from "../value-objects/unique-entity-id.vo";
import { ValueObject } from "../value-objects/value-object";

export abstract class Entity<Props extends Record<string, any>> {
  protected readonly _id: UniqueEntityID;
  protected readonly _props: Props;

  constructor(props: Props, id?: UniqueEntityID) {
    this._id = id ?? new UniqueEntityID();
    this._props = props;
  }

  get id(): string {
    return this._id.value;
  }

  get props(): Props {
    return {
      ...this._props,
    };
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

    const props = getProps(this._props);
    return {
      id: this.id,
      ...props,
    };
  }
}
