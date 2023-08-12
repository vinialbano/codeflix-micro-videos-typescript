import { DeepPartial } from '#seedwork/@types/deep-partial';
import { EntityValidationError, ValidationErrors } from '#seedwork/domain';
import { expect } from '@jest/globals';
import type { MatcherFunction } from 'expect';

const toContainErrorMessages: MatcherFunction<
  [errors: DeepPartial<ValidationErrors>]
> = function (actual, errors) {
  const makeReturnMessage = (
    actual: unknown,
    errors: DeepPartial<ValidationErrors>,
  ) => {
    if (matchesObject(actual, errors)) {
      return {
        pass: true,
        message: () =>
          `expected ${this.utils.printReceived(
            actual,
          )} not to contain error messages ${this.utils.printExpected(errors)}`,
      };
    } else {
      return {
        pass: false,
        message: () =>
          `expected ${this.utils.printReceived(
            actual,
          )} to contain error messages ${this.utils.printExpected(errors)}`,
      };
    }
  };

  if (typeof actual === 'function') {
    try {
      actual();
      return makeReturnMessage(null, errors);
    } catch (e) {
      const error = e as EntityValidationError;
      return makeReturnMessage(error.errors, errors);
    }
  } else {
    return makeReturnMessage(actual, errors);
  }
};

function matchesObject(actual: any, expected: any) {
  try {
    expect(actual).toMatchObject(expected);
    return true;
  } catch (e) {
    return false;
  }
}

expect.extend({
  toContainErrorMessages,
});

declare global {
  namespace jest {
    interface AsymmetricMatchers {
      toContainErrorMessages(errors: DeepPartial<ValidationErrors>): void;
    }
    interface Matchers<R> {
      toContainErrorMessages(error: DeepPartial<ValidationErrors>): R;
    }
  }
}
