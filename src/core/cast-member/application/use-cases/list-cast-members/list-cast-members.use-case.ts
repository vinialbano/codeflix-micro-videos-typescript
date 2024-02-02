import { CastMember } from '../../../domain/cast-member.aggregate';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '../../../../shared/application/pagination-output';
import { UseCase } from '../../../../shared/application/use-case';
import { SortDirection } from '../../../../shared/domain/repository/search-params';

import {
  CastMemberFilter,
  CastMemberRepository,
  CastMemberSearchParams,
  CastMemberSearchResult,
} from '../../../domain/cast-member.repository';
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from '../shared/cast-member-output';

export class ListCastMembersUseCase
  implements UseCase<ListCastMembersInput, ListCastMembersOutput>
{
  constructor(private readonly castMemberRepository: CastMemberRepository) {}

  async execute(input: ListCastMembersInput): Promise<ListCastMembersOutput> {
    const params = new CastMemberSearchParams({
      ...(input.page && { page: input.page }),
      ...(input.limit && { limit: input.limit }),
      ...(input.filter && { filter: input.filter }),
      ...(input.sort && {
        sortCriteria: {
          field: input.sort as keyof CastMember,
          ...(input.sortDirection && { direction: input.sortDirection }),
        },
      }),
    });
    const searchResult = await this.castMemberRepository.search(params);
    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: CastMemberSearchResult) {
    const items = searchResult.items.map((i) =>
      CastMemberOutputMapper.toDTO(i),
    );
    return PaginationOutputMapper.toDTO(items, searchResult);
  }
}

export type ListCastMembersInput = {
  page?: number;
  limit?: number;
  sort?: string | null;
  sortDirection?: SortDirection | null;
  filter?: CastMemberFilter | null;
};

export type ListCastMembersOutput = PaginationOutput<CastMemberOutput>;
