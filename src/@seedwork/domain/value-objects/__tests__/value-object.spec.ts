import { ValueObject } from "../value-object";

class StubValueObject extends ValueObject<unknown> {}

describe("ValueObject Unit Tests", () => {
  describe("Constructor of ValueObject", () => {
    it.each(["value", { prop: "value" }])(
      "should create a value object with the given value",
      (value) => {
        const vo = new StubValueObject(value);
        expect(vo).toBeDefined();
        expect(vo.value).toStrictEqual(value);
      }
    );

    it("should be immutable", () => {
      const props = {
        prop: "value",
        nested: {
          prop: "value",
        },
      };
      const vo = new StubValueObject(props) as ValueObject<typeof props>;
      expect(() => {
        (vo as any)["_value"] = "other value";
      }).toThrow(
        "Cannot assign to read only property '_value' of object '[object Object]'"
      );
      expect(() => {
        vo["_value"].prop = "other value";
      }).toThrow(
        "Cannot assign to read only property 'prop' of object '#<Object>'"
      );
      expect(() => {
        vo["_value"].nested.prop = "other value";
      }).toThrow(
        "Cannot assign to read only property 'prop' of object '#<Object>'"
      );
    });
  });

  describe("toString() method", () => {
    it.each([
      [undefined, "undefined"],
      [null, "null"],
      [0, "0"],
      [1, "1"],
      ["", ""],
      ["value", "value"],
      [{ prop: "value" }, JSON.stringify({ prop: "value" })],
      [new Date("2021-01-01"), "2021-01-01T00:00:00.000Z"],
    ])(
      "should return the string representation of the value object",
      (value: unknown, expected: string) => {
        const vo = new StubValueObject(value);
        expect(vo.toString()).toBe(expected);
      }
    );
  });

  describe("toJSON() method", () => {
    it.each([
      [undefined, undefined],
      [null, null],
      [0, 0],
      [1, 1],
      ["", ""],
      ["value", "value"],
      [{ prop: "value" }, { prop: "value" }],
    ])(
      "should return the json representation of the value object",
      <T>(value: T, expected: T) => {
        const vo = new StubValueObject(value);
        expect(vo.toJSON()).toStrictEqual(expected);
      }
    );
  });
});
