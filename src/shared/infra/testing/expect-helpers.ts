import {
  MatcherHintOptions,
  RECEIVED_COLOR,
  matcherErrorMessage,
  matcherHint,
  printDiffOrStringify,
  printExpected,
  printReceived,
  printWithType,
  stringify,
} from "jest-matcher-utils";
import { ValidationError } from "../../domain/validators/validation.error";
import { ErrorFields } from "../../domain/validators/validator-fields";

expect.extend({
  toContainErrorFields(received: ValidationError, expected: ErrorFields) {
    const matcherName = "toContainErrorFields";
    const options: MatcherHintOptions = {
      comment: "ErrorFields should match",
      isNot: this.isNot!,
      promise: this.promise!,
    };

    if (!(received instanceof ValidationError)) {
      throw new Error(
        matcherErrorMessage(
          matcherHint(matcherName, undefined, undefined, options),
          `${RECEIVED_COLOR(
            "received"
          )} value must be an instance of ValidationError`,
          printWithType("Received", received, printReceived)
        )
      );
    }

    const receivedErrors = received.errors;
    const pass = expect
      .objectContaining(expected)
      .asymmetricMatch(receivedErrors);
    const message: () => string = makeMessage.call(
      this,
      matcherName,
      expected,
      receivedErrors,
      pass
    );

    return { actual: receivedErrors, message, pass };
  },
  toThrowWithErrorFields(received: () => any, expected: ErrorFields) {
    const matcherName = "toThrowWithErrorFields";
    const options: MatcherHintOptions = {
      comment: "ErrorFields should match",
      isNot: this.isNot!,
      promise: this.promise!,
    };

    if (typeof received !== "function") {
      throw new Error(
        matcherErrorMessage(
          matcherHint(matcherName, undefined, undefined, options),
          `${RECEIVED_COLOR("received")} value must be a function`,
          printWithType("Received", received, printReceived)
        )
      );
    }

    let receivedErrors: ErrorFields | undefined = undefined;
    try {
      received();
    } catch (e) {
      if (!(e instanceof ValidationError)) {
        if (!(e instanceof Error)) {
          throw e;
        }
        throw new Error(
          matcherErrorMessage(
            matcherHint(matcherName, undefined, undefined, options),
            `${RECEIVED_COLOR(
              "thrown error"
            )} must be an instance of ValidationError`,
            `Thrown error type:    ${printReceived(e.constructor.name)}\n` +
              `Thrown error message: ${printReceived(e.message)}`
          )
        );
      }
      receivedErrors = e.errors;
    }

    if (!receivedErrors) {
      throw new Error(
        matcherErrorMessage(
          matcherHint(matcherName, undefined, undefined, options),
          `${RECEIVED_COLOR("received")} function must throw a ValidationError`,
          `${RECEIVED_COLOR("received")} function did not throw`
        )
      );
    }

    const pass: boolean = expect
      .objectContaining(expected)
      .asymmetricMatch(receivedErrors);
    const message: () => string = makeMessage.call(
      this,
      matcherName,
      expected,
      receivedErrors,
      pass
    );

    return { actual: receivedErrors, message, pass };
  },
});

function makeMessage(
  this: jest.MatcherContext,
  matcherName: string,
  expected: unknown,
  received: unknown,
  pass: boolean
) {
  const options = {
    comment: "ErrorFields should match",
    isNot: this.isNot!,
    promise: this.promise!,
  };
  return pass
    ? () => makePassMessage(matcherName, expected, received, options)
    : () =>
        makeFailMessage(matcherName, expected, received, options, this.expand!);
}

const makePassMessage = (
  matcherName: string,
  expected: unknown,
  received: unknown,
  options: MatcherHintOptions
) =>
  matcherHint(matcherName, undefined, undefined, options) +
  "\n\n" +
  `Expected: not ${printExpected(expected)}` +
  (stringify(expected) === stringify(received)
    ? ""
    : `\nReceived:     ${printReceived(received)}`);

const makeFailMessage = (
  matcherName: string,
  expected: unknown,
  received: unknown,
  options: MatcherHintOptions,
  expand: boolean
) =>
  matcherHint(matcherName, undefined, undefined, options) +
  "\n\n" +
  printDiffOrStringify(expected, received, "expected", "received", expand);
