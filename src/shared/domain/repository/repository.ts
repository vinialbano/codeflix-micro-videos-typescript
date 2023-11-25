import { Entity } from "../entity";
import { ValueObject } from "../value-objects/value-object";
import { SearchParams } from "./search-params";
import { SearchResult } from "./search-result";

export interface Repository<E extends Entity, EntityId extends ValueObject> {
  insert(entity: E): Promise<void>;
  insertMany(entities: E[]): Promise<void>;
  update(entity: E): Promise<void>;
  delete(entity: E): Promise<void>;

  findById(entityId: EntityId): Promise<E | null>;
  findAll(): Promise<E[]>;
}

export interface SearchableRepository<
  E extends Entity,
  EntityId extends ValueObject,
  Filter = string,
  SearchInput = SearchParams<Filter>,
  SearchOutput = SearchResult<E>
> extends Repository<E, EntityId> {
  sortableFields: string[];
  search(props: SearchInput): Promise<SearchOutput>;
}
