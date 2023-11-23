import { ClassValidatorFields } from "../../domain/validators/class-validator-fields";
import { EntityValidationError } from "../../domain/validators/validation.error";
import { ErrorFields } from "../../domain/validators/validator-fields";
import {
  EXPECTED_COLOR as expectedColor,
  RECEIVED_COLOR as receivedColor,
  diff,
} from "jest-matcher-utils";

type Expected =
  | { validator: ClassValidatorFields<any>; data: any }
  | (() => any);

expect.extend({
  toContainValidationErrors(expected: Expected, received: ErrorFields) {
    if (typeof expected === "function") {
      try {
        expected = expected();
        return validated();
      } catch (e) {
        const error = e as EntityValidationError;
        return assertContainsErrorMessages(error.errors, received);
      }
    } else {
      const { validator, data } = expected;
      const isValid = validator.validate(data);
      if (isValid) {
        return validated();
      }
      return assertContainsErrorMessages(validator.errors!, received);
    }
  },
});

const validated = () => {
  return { pass: true, message: () => "" };
};

const assertContainsErrorMessages = (
  expected: ErrorFields,
  received: ErrorFields
) => {
  const isMatch = expect.objectContaining(received).asymmetricMatch(expected);
  return isMatch
    ? validated()
    : {
        pass: false,
        message: () =>
          `expect(${expectedColor(
            "received"
          )}).toContainValidationErrors(${receivedColor(
            "expected"
          )})\n\nExpected to contain validation error messages\n\n${diff(
            expected,
            received
          )}`,
      };
};
