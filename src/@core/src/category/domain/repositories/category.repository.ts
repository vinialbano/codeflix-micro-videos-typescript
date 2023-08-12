import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchResultProps,
  SearchableRepository,
} from '#seedwork/domain';
import { Category } from '../entitites';

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
