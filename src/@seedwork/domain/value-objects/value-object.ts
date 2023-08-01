import { deepFreeze } from "../utils/object";

export abstract class ValueObject<T = any> {
  protected readonly _value: T;

  constructor(value: T) {
    this._value = deepFreeze(value);
    Object.freeze(this);
  }

  get value(): T {
    return this._value;
  }

  toString() {
    if (!this._value) {
      return String(this._value);
    }
    if (this._value instanceof Date) {
      return this._value.toISOString();
    }
    if (this._value.toString() === "[object Object]") {
      return JSON.stringify(this._value);
    }
    return this._value.toString();
  }

  toJSON() {
    return this._value;
  }
}
