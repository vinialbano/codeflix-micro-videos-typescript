import exp from "constants";
import { Entity } from "../../../domain/entity";
import { UUID } from "../../../domain/value-objects/uuid.vo";
import { ValueObject } from "../../../domain/value-objects/value-object";
import { InMemoryRepository } from "../in-memory.repository";
import { NotFoundError } from "../../../domain/errors/not-found.error";

class StubEntity extends Entity {
  constructor(public readonly entityId: UUID, public name: string) {
    super();
  }
  toJSON() {
    return {
      entityId: this.entityId.id,
      name: this.name,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, UUID> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe("InMemoryRepository Unit Tests", () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  describe("insert()", () => {
    it("should insert an entity", async () => {
      const entity = new StubEntity(new UUID(), "Stub Entity");
      await repository.insert(entity);
      expect(repository.items).toHaveLength(1);
      expect(repository.items[0]).toBe(entity);
    });
  });

  describe("insertMany()", () => {
    it("should insert many entities", async () => {
      const entities = [
        new StubEntity(new UUID(), "Stub Entity 1"),
        new StubEntity(new UUID(), "Stub Entity 2"),
      ];
      await repository.insertMany(entities);
      expect(repository.items).toHaveLength(2);
      expect(repository.items[0]).toBe(entities[0]);
      expect(repository.items[1]).toBe(entities[1]);
    });
  });

  describe("update()", () => {
    it("should update an entity", async () => {
      const entity = new StubEntity(new UUID(), "Stub Entity");
      await repository.insert(entity);
      entity.name = "Updated Stub Entity";
      await repository.update(entity);
      expect(repository.items).toHaveLength(1);
      expect(repository.items[0]).toBe(entity);
      expect(repository.items[0]!.name).toBe("Updated Stub Entity");
    });

    it("should throw an error if the entity is not found", async () => {
      const entity = new StubEntity(new UUID(), "Stub Entity");
      await expect(repository.update(entity)).rejects.toThrow(
        new NotFoundError(entity.entityId, StubEntity)
      );
    });
  });

  describe("delete()", () => {
    it("should delete an entity", async () => {
      const id = new UUID()
      const entity = new StubEntity(id, "Stub Entity");
      await repository.insert(entity);
      await repository.delete(id);
      expect(repository.items).toHaveLength(0);
    });

    it("should throw an error if the entity is not found", async () => {
      const id = new UUID();
      await expect(repository.delete(id)).rejects.toThrow(
        new NotFoundError(id, StubEntity)
      );
    });
  });

  describe("findById()", () => {
    it("should find an entity by id", async () => {
      const entity = new StubEntity(new UUID(), "Stub Entity");
      await repository.insert(entity);
      const foundEntity = await repository.findById(entity.entityId);
      expect(foundEntity).toBe(entity);
    });

    it("should return null if no entity is found", async () => {
      const foundEntity = await repository.findById(new UUID());
      expect(foundEntity).toBeNull();
    });
  });

  describe("findAll()", () => {
    it("should find all entities", async () => {
      const entities = [
        new StubEntity(new UUID(), "Stub Entity 1"),
        new StubEntity(new UUID(), "Stub Entity 2"),
      ];
      await repository.insertMany(entities);
      const foundEntities = await repository.findAll();
      expect(foundEntities).toHaveLength(2);
      expect(foundEntities[0]).toBe(entities[0]);
      expect(foundEntities[1]).toBe(entities[1]);
    });

    it("should return an empty array if no entities are found", async () => {
      const foundEntities = await repository.findAll();
      expect(foundEntities).toHaveLength(0);
    });
  });

  describe("getEntity()", () => {
    it("should return the entity class", async () => {
      expect(repository.getEntity()).toBe(StubEntity);
    });
  });
});
