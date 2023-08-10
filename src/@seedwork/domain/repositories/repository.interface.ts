import { Entity } from "../entities/entity";
import { UniqueEntityID } from "../value-objects/unique-entity-id.vo";
import { SearchParams } from "./search-params";
import { SearchResult } from "./search-result";

export interface Repository<E extends Entity<any>> {
  insert(entity: E): Promise<void>;
  findById(id: string | UniqueEntityID): Promise<E>;
  findAll(entity: E): Promise<E[]>;
  update(entity: E): Promise<void>;
  delete(id: string | UniqueEntityID): Promise<void>;
}

export interface SearchableRepository<
  E extends Entity<any>,
  Filter = string,
  SearchInput = SearchParams<E, Filter>,
  SearchOutput = SearchResult<E, Filter>
> extends Repository<E> {
  sortableFields: Array<"id" | keyof E["props"]>;
  search(props: SearchInput): Promise<SearchOutput>;
}
