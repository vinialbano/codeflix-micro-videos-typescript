import { SearchableRepository } from '../../shared/domain/repository/repository';
import { SearchParams } from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';
import { CastMemberType } from './cast-member-type.vo';
import { CastMember, CastMemberId } from './cast-member.aggregate';

export type CastMemberFilter = {
  name?: string;
  type?: CastMemberType;
};

export class CastMemberSearchParams extends SearchParams<
  CastMember,
  CastMemberFilter
> {}

export class CastMemberSearchResult extends SearchResult<CastMember> {}

export interface CastMemberRepository
  extends SearchableRepository<
    CastMember,
    CastMemberId,
    CastMemberFilter,
    CastMemberSearchParams,
    CastMemberSearchResult
  > {}
