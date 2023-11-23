import { EntityValidationError } from "../validation.error";

describe("EntityValidationError", () => {
  describe("constructor", () => {
    it("should create an instance with the given errors", () => {
      const errors = { name: ["Name is required"] };
      const error = new EntityValidationError(errors);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Entity validation error");
      expect(error.errors).toBe(errors);
    });
  });

  describe("count()", () => {
    it("should return the number of errors", () => {
      const errors = { name: ["Name is required"] };
      const error = new EntityValidationError(errors);
      expect(error.count()).toBe(1);
    });
  });
});
