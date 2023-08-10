import { Entity } from "../../entities/entity";
import { NotFoundError } from "../../errors/not-found.error";
import { InMemoryRepository } from "../in-memory.repository";

interface StubEntityProps {
  name: string;
}

class StubEntity extends Entity<StubEntityProps> {
  get name(): string {
    return this._props.name;
  }

  setName(name: string): void {
    this._props.name = name;
  }
}

class StubRepository extends InMemoryRepository<StubEntity> {}

const makeSut = () => {
  const sut = new StubRepository();
  return { sut };
};

describe("InMemoryRepository Unit Tests", () => {
  describe("insert()", () => {
    it("should insert a new entity", async () => {
      const { sut } = makeSut();
      const entity = new StubEntity({ name: "any_name" });
      await sut.insert(entity);
      expect(entity.toJSON()).toStrictEqual(sut.items[0].toJSON());
    });
  });

  describe("findById()", () => {
    it("should find an entity by id", async () => {
      const { sut } = makeSut();
      const entity = new StubEntity({ name: "any_name" });
      sut.items.push(entity);
      const result = await sut.findById(entity.id);
      expect(result).toStrictEqual(entity);
    });

    it("should find an entity by string id", async () => {
      const { sut } = makeSut();
      const entity = new StubEntity({ name: "any_name" });
      sut.items.push(entity);
      const result = await sut.findById(`${entity.id}`);
      expect(result).toStrictEqual(entity);
    });

    it("should throw an error if entity is not found", async () => {
      const { sut } = makeSut();
      const entity = new StubEntity({ name: "any_name" });
      sut.items.push(entity);
      const promise = sut.findById("any_id");
      await expect(promise).rejects.toThrowError(
        new NotFoundError("Entity not found using ID any_id")
      );
    });
  });

  describe("findAll()", () => {
    it("should find all entities", async () => {
      const { sut } = makeSut();
      const entity = new StubEntity({ name: "any_name" });
      sut.items.push(entity);
      const result = await sut.findAll();
      expect(result).toStrictEqual([entity]);
    });

    it("should throw an error if entity is not found", async () => {
      const { sut } = makeSut();
      const entity = new StubEntity({ name: "any_name" });
      sut.items.push(entity);
      const promise = sut.findById("any_id");
      await expect(promise).rejects.toThrowError(
        new NotFoundError("Entity not found using ID any_id")
      );
    });
  });

  describe("update()", () => {
    it("should update an entity", async () => {
      const { sut } = makeSut();
      const entity = new StubEntity({ name: "any_name" });
      sut.items.push(entity);
      entity.setName("new_name");
      await sut.update(entity);
      expect(sut.items[0].name).toBe("new_name");
    });

    it("should throw an error if entity is not found", async () => {
      const { sut } = makeSut();
      const entity = new StubEntity({ name: "any_name" });
      const promise = sut.update(entity);
      await expect(promise).rejects.toThrowError(
        new NotFoundError(`Entity not found using ID ${entity.id}`)
      );
    });
  });

  describe("delete()", () => {
    it("should delete an entity by id", async () => {
      const { sut } = makeSut();
      const entity = new StubEntity({ name: "any_name" });
      sut.items.push(entity);
      await sut.delete(entity.id);
      expect(sut.items.length).toBe(0);
    });

    it("should delete an entity by string id", async () => {
      const { sut } = makeSut();
      const entity = new StubEntity({ name: "any_name" });
      sut.items.push(entity);
      await sut.delete(`${entity.id}`);
      expect(sut.items.length).toBe(0);
    });

    it("should throw an error if entity is not found", async () => {
      const { sut } = makeSut();
      const promise = sut.delete("any_id");
      await expect(promise).rejects.toThrowError(
        new NotFoundError("Entity not found using ID any_id")
      );
    });
  });
});
