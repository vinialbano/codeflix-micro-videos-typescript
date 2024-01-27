import { ErrorFields } from '../validators/validator-fields';

export class ValidationError extends Error {
  constructor(
    public readonly errors: ErrorFields[],
    message = 'Validation error',
  ) {
    super(message);
    this.name = 'ValidationError';
  }

  count(): number {
    return this.errors.length;
  }
}

export class EntityValidationError extends ValidationError {
  constructor(
    public readonly errors: ErrorFields[],
    message = 'Entity validation error',
  ) {
    super(errors, message);
    this.name = 'EntityValidationError';
  }
}
