import { ErrorFields } from "./validator-fields";

export class EntityValidationError extends Error {
  constructor(
    public readonly errors: ErrorFields,
    message = "Entity validation error"
  ) {
    super(message);
    this.name = "EntityValidationError";
  }

  count(): number {
    return Object.keys(this.errors).length;
  }
}
