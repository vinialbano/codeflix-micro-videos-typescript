import { UniqueEntityID } from "../value-objects/unique-entity-id.vo";
import { ValueObject } from "../value-objects/value-object";
import { Entity } from "./entity";

class StubValueObject extends ValueObject<any> {}
class StubEntity extends Entity<{ [key: string]: any }> {}

describe("Entity Unit Tests", () => {
  describe("Constructor of Entity", () => {
    it.each([new UniqueEntityID(), null, undefined])(
      "should have a valid id",
      (id) => {
        const entity = new StubEntity({ prop: "value" }, id);
        expect((entity as any)._id).toBeInstanceOf(UniqueEntityID);
        expect(entity.id).toBe((entity as any)._id.value);
      }
    );

    it("should have a valid props", () => {
      const props = {
        prop: "value",
      };
      const entity = new StubEntity(props);
      expect((entity as any).props).toStrictEqual(props);
    });
  });

  describe("toJSON method", () => {
    const date = new Date("2021-01-01");
    it.each([
      {
        given: {
          string: "value",
          number: 1,
          boolean: true,
          date,
        },
        expected: {
          string: "value",
          number: 1,
          boolean: true,
          date,
        },
      },
      {
        given: {
          vo: new StubValueObject({
            string: "value",
            number: 1,
            boolean: true,
            date,
          }),
        },
        expected: {
          vo: {
            string: "value",
            number: 1,
            boolean: true,
            date,
          },
        },
      },
      {
        given: {
          nested: {
            prop: "value",
            vo: new StubValueObject({ prop: "value" }),
          },
        },
        expected: {
          nested: {
            prop: "value",
            vo: {
              prop: "value",
            },
          },
        },
      },
      {
        given: {
          array: [
            new StubValueObject({ prop: "value" }),
            "value",
            {
              prop: "value",
              vo: new StubValueObject({ prop: "value" }),
            },
          ],
        },
        expected: {
          array: [
            {
              prop: "value",
            },
            "value",
            {
              prop: "value",
              vo: {
                prop: "value",
              },
            },
          ],
        },
      },
    ])("should return the entity as a json", ({ given, expected }) => {
      const entity = new StubEntity(given);
      const json = entity.toJSON();
      expect(json).toStrictEqual({
        id: entity.id,
        ...expected,
      });
    });
  });
});
