import { Entity, EntityPropsKeys } from "../entities";
import { UniqueEntityID } from "../value-objects";
import { SearchParams } from "./search-params";
import { SearchResult } from "./search-result";

export interface Repository<E extends Entity> {
  insert(entity: E): Promise<void>;
  findById(id: string | UniqueEntityID): Promise<E>;
  findAll(entity: E): Promise<E[]>;
  update(entity: E): Promise<void>;
  delete(id: string | UniqueEntityID): Promise<void>;
}

export interface SearchableRepository<
  E extends Entity,
  Filter = string,
  SearchInput = SearchParams<E, Filter>,
  SearchOutput = SearchResult<E, Filter>
> extends Repository<E> {
  sortableFields: Array<"id" | EntityPropsKeys<E>>;
  search(props: SearchInput): Promise<SearchOutput>;
}
