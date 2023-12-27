import { Entity } from "../../domain/entity";
import { NotFoundError } from "../../domain/errors/not-found.error";
import { Repository } from "../../domain/repository/repository";
import { ValueObject } from "../../domain/value-objects/value-object";

export abstract class InMemoryRepository<
  E extends Entity,
  EntityId extends ValueObject
> implements Repository<E, EntityId>
{
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async insertMany(entities: E[]): Promise<void> {
    this.items.push(...entities);
  }

  async update(entity: E): Promise<void> {
    const indexFound = this.items.findIndex((item) =>
      item.entityId.equals(entity.entityId)
    );
    if (indexFound === -1) {
      throw new NotFoundError(entity.entityId, this.getEntity());
    }
    this.items[indexFound] = entity;
  }

  async delete(entityId: EntityId): Promise<void> {
    const indexFound = this.items.findIndex((item) =>
      item.entityId.equals(entityId)
    );
    if (indexFound === -1) {
      throw new NotFoundError(entityId, this.getEntity());
    }
    this.items.splice(indexFound, 1);
  }

  async findById(entityId: EntityId): Promise<E | null> {
    const item = this.items.find((item) => item.entityId.equals(entityId));
    return item ?? null;
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  abstract getEntity(): new (...args: any[]) => E;
}
