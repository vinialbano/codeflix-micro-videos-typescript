import { ValueObject } from "./value-objects/value-object";

export abstract class Entity {
  abstract get entityId(): ValueObject;
  abstract toJSON(): Record<string, unknown>;
}
