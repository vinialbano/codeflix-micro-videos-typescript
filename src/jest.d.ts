import { ErrorFields } from "./shared/domain/validators/validator-fields";

declare global {
  namespace jest {
    interface Matchers<R> {
      toContainValidationErrors(expected: ErrorFields): R;
    }
  }
}
