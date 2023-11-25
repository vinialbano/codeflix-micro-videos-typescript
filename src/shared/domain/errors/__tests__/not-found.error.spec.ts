import { Entity } from "../../entity";
import { UUID } from "../../value-objects/uuid.vo";
import { NotFoundError } from "../not-found.error";

class StubEntity extends Entity {
  get entityId(): UUID {
    return new UUID();
  }
  toJSON() {
    return {
      entityId: this.entityId.id,
    };
  }
}
describe("NotFoundError Unit Tests", () => {
  it("should create a NotFoundError instance with the given id and entity class", () => {
    const id = "1";

    const notFoundError = new NotFoundError(id, StubEntity);
    expect(notFoundError.message).toBe(
      "Entity StubEntity not found with id(s): 1"
    );
    expect(notFoundError.name).toBe("NotFoundError");
  });

  it("should create a NotFoundError instance with the given id array and entity class", () => {
    const id = ["1", "2"];

    const notFoundError = new NotFoundError(id, StubEntity);
    expect(notFoundError.message).toBe(
      "Entity StubEntity not found with id(s): 1, 2"
    );
    expect(notFoundError.name).toBe("NotFoundError");
  });
});
