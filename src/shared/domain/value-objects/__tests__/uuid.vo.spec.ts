import { UUID, isValidUUIDv4 } from "../uuid.vo";

describe("UUID Unit Tests", () => {
  describe("constructor()", () => {
    const validateSpy = jest.spyOn(UUID.prototype, "validate" as any);

    it("should create a new UUID with a valid v4 UUID", () => {
      const uuid = new UUID();
      expect(uuid).toBeDefined();
      expect(uuid.id).toBeDefined();
      expect(isValidUUIDv4(uuid.id)).toBe(true);
      expect(validateSpy).toHaveBeenCalled();
    });

    it("should create a new UUID with the given valid v4 UUID", () => {
      const uuid = new UUID("f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e");
      expect(uuid).toBeDefined();
      expect(uuid.id).toBeDefined();
      expect(uuid.id).toBe("f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e");
      expect(isValidUUIDv4(uuid.id)).toBe(true);
      expect(validateSpy).toHaveBeenCalled();
    });

    it("should throw an error if the given UUID is invalid", () => {
      expect(() => new UUID("invalid-uuid")).toThrow(
        "Invalid UUID: invalid-uuid"
      );
      expect(validateSpy).toHaveBeenCalled();
    });
  });
});
