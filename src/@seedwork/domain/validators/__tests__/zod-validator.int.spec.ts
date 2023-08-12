import { ZodValidator } from "#seedwork/domain";
import { z } from "zod";

class StubValidator extends ZodValidator<{
  name: string;
  age: number;
  location: { country: string; state: string };
  hobbies: string[];
}> {
  constructor() {
    super(
      z.object({
        name: z.string(),
        age: z.number(),
        location: z.object({ country: z.string(), state: z.string() }),
        hobbies: z.array(z.string()).min(2),
      })
    );
  }
}

describe("ZodValidator Integration Tests", () => {
  describe("validate()", () => {
    it("should set errors when input is invalid", () => {
      const input = {
        name: "John Doe",
        age: 30,
        location: {},
        hobbies: [1],
      };
      const validator = new StubValidator();
      validator.validate(input);
      expect(validator.errors).toStrictEqual({
        _errors: [],
        location: {
          _errors: [],
          country: {
            _errors: ["Required"],
          },
          state: {
            _errors: ["Required"],
          },
        },
        hobbies: {
          _errors: ["Array must contain at least 2 element(s)"],
          0: {
            _errors: ["Expected string, received number"],
          },
        },
      });
    });

    it("should set validatedData when input is valid", () => {
      const input = {
        name: "John Doe",
        age: 30,
        location: { country: "Brazil", state: "SP" },
        hobbies: ["Soccer", "Basketball"],
      };
      const validator = new StubValidator();
      validator.validate(input);
      expect(validator.validatedData).toStrictEqual(input);
    });
  });
});
