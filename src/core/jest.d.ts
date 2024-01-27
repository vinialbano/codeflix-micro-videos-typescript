import { ErrorFields } from './shared/domain/validators/validator-fields';

declare global {
  namespace jest {
    interface Matchers<R> {
      toContainErrorFields(expected: ErrorFields): R;
      toThrowWithErrorFields(expected: ErrorFields): R;
      toContainNotificationErrorMessages: (
        expected: Array<string | { [key: string]: string[] }>,
      ) => R;
    }
  }
}
