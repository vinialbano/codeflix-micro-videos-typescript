import { ValidationErrors } from "../validators/validator.interface";

export class ValidationError extends Error {
  constructor(message: string = "Validation Error") {
    super(message);
    this.name = "ValidationError";
  }
}

export class EntityValidationError extends Error {
  constructor(
    public errors: ValidationErrors,
    message: string = "Entity Validation Error"
  ) {
    super(message);
    this.name = "EntityValidationError";
  }
}

export class RepositoryValidationError extends Error {
  constructor(
    public errors: ValidationErrors,
    message: string = "Repository Validation Error"
  ) {
    super(message);
    this.name = "RepositoryValidationError";
  }
}
