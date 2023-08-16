import { ValidationErrors } from '../validators';

export class EntityLoadError extends Error {
  constructor(
    public errors: ValidationErrors,
    message: string = 'An entity could not be loaded',
  ) {
    super(message);
    this.name = 'EntityLoadError';
  }
}
