import { SearchableRepository } from "../../../@seedwork/domain/repositories/repository.interface";
import { SearchParams as DefaultSearchParams } from "../../../@seedwork/domain/repositories/search-params";
import {
  SearchResult as DefaultSearchResult,
  SearchResultProps,
} from "../../../@seedwork/domain/repositories/search-result";
import { Category } from "../entitites/category";

export namespace CategoryRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Category, Filter> {}

  export class SearchResult extends DefaultSearchResult<Category, Filter> {
    constructor(props: SearchResultProps<Category, Filter>) {
      super(props, Category);
    }
  }

  export interface Repository extends SearchableRepository<Category, Filter> {}
}
