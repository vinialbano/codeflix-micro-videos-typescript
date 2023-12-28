import {
  matcherErrorMessage,
  matcherHint,
  printDiffOrStringify,
  printExpected,
  printReceived,
  printWithType,
  RECEIVED_COLOR as receivedColor,
  stringify,
} from "jest-matcher-utils";
import { ValidationError } from "../../domain/errors/validation.error";
import { ErrorFields } from "../../domain/validators/validator-fields";
import { Notification } from "../../domain/validators/notification";

expect.extend({
  // toContainErrorFields(received: ValidationError, expected: ErrorFields) {
  //   const matcherHintOutput = matcherHint(
  //     "toContainErrorFields",
  //     undefined,
  //     undefined,
  //     {
  //       comment: "ErrorFields should match",
  //       isNot: this.isNot!,
  //       promise: this.promise!,
  //     }
  //   );

  //   if (!(received instanceof ValidationError)) {
  //     return {
  //       pass: !!this.isNot,
  //       message: () =>
  //         matcherErrorMessage(
  //           matcherHintOutput,
  //           `${receivedColor(
  //             "received"
  //           )} value must be an instance of ValidationError`,
  //           printWithType("Received", received, printReceived)
  //         ),
  //     };
  //   }

  //   const receivedErrors = received.errors;
  //   const pass = expect
  //     .objectContaining(expected)
  //     .asymmetricMatch(receivedErrors);
  //   const diffOutput = printDiffOrStringify(
  //     expected,
  //     receivedErrors,
  //     "expected",
  //     "received",
  //     this.expand!
  //   );
  //   const message = pass
  //     ? () => makePassMessage(matcherHintOutput, expected, receivedErrors)
  //     : () => makeFailMessage(matcherHintOutput, diffOutput);

  //   return { actual: receivedErrors, message, pass };
  // },

  // toThrowWithErrorFields(received: () => any, expected: ErrorFields) {
  //   const matcherHintOutput = matcherHint(
  //     "toThrowWithErrorFields",
  //     undefined,
  //     undefined,
  //     {
  //       comment: "ErrorFields should match",
  //       isNot: this.isNot!,
  //       promise: this.promise!,
  //     }
  //   );

  //   if (typeof received !== "function") {
  //     return {
  //       pass: !!this.isNot,
  //       message: () =>
  //         matcherErrorMessage(
  //           matcherHintOutput,
  //           `${receivedColor("received")} value must be a function`,
  //           printWithType("Received", received, printReceived)
  //         ),
  //     };
  //   }

  //   let receivedErrors: ErrorFields | undefined = undefined;
  //   try {
  //     received();
  //     return {
  //       pass: !!this.isNot,
  //       message: () =>
  //         matcherErrorMessage(
  //           matcherHintOutput,
  //           `${receivedColor(
  //             "received"
  //           )} function must throw a ValidationError`,
  //           `${receivedColor("received")} function did not throw`
  //         ),
  //     };
  //   } catch (e) {
  //     if (!(e instanceof Error)) {
  //       throw e;
  //     }
  //     if (!(e instanceof ValidationError)) {
  //       return {
  //         pass: !!this.isNot,
  //         message: () =>
  //           matcherErrorMessage(
  //             matcherHintOutput,
  //             `${receivedColor(
  //               "thrown error"
  //             )} must be an instance of ValidationError`,
  //             `Thrown error type:    ${printReceived(
  //               (e as Error).constructor.name
  //             )}\n` +
  //               `Thrown error message: ${printReceived((e as Error).message)}`
  //           ),
  //       };
  //     }
  //     receivedErrors = e.errors;
  //     const pass: boolean = expect
  //       .objectContaining(expected)
  //       .asymmetricMatch(receivedErrors);
  //     const diffOutput = printDiffOrStringify(
  //       expected,
  //       receivedErrors,
  //       "expected",
  //       "received",
  //       this.expand!
  //     );
  //     const message = pass
  //       ? () => makePassMessage(matcherHintOutput, expected, receivedErrors)
  //       : () => makeFailMessage(matcherHintOutput, diffOutput);

  //     return { actual: receivedErrors, message, pass };
  //   }
  // },
  toContainNotificationErrorMessages(
    received: Notification,
    expected: Array<string | { [key: string]: string[] }>
  ) {
    const matcherHintOutput = matcherHint(
      "toContainNotificationErrorMessages",
      undefined,
      undefined,
      {
        comment: "Notification error messages should match",
        isNot: this.isNot!,
        promise: this.promise!,
      }
    );
    const every = expected.every((error) => {
      if (typeof error === "string") {
        return received.errors.has(error);
      } else {
        return Object.entries(error).every(([field, messages]) => {
          const fieldMessages = received.errors.get(field) as string[];
          if (!fieldMessages) {
            return false;
          }
          return (
            fieldMessages.length &&
            messages.every((message) => fieldMessages.includes(message))
          );
        });
      }
    });
    const diffOutput = printDiffOrStringify(
      expected,
      received.toJSON(),
      "expected",
      "received",
      this.expand!
    );
    const message = every
      ? () => makePassMessage(matcherHintOutput, expected, received)
      : () => makeFailMessage(matcherHintOutput, diffOutput);
    return { message, pass: every };
  },
});

const makePassMessage = (
  matcherHintOutput: string,
  expected: unknown,
  received: unknown
) =>
  matcherHintOutput +
  `\n\nExpected: not ${printExpected(expected)}` +
  (stringify(expected) === stringify(received)
    ? ""
    : `\nReceived:     ${printReceived(received)}`);

const makeFailMessage = (matcherHintOutput: string, diffOutput: string) =>
  matcherHintOutput + "\n\n" + diffOutput;
