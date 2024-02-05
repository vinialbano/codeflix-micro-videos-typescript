import {
  PaginationOutput,
  PaginationOutputMapper,
} from '../../../../shared/application/pagination-output';
import { UseCase } from '../../../../shared/application/use-case';

import {
  CastMemberRepository,
  CastMemberSearchParams,
  CastMemberSearchResult,
} from '../../../domain/cast-member.repository';
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from '../shared/cast-member-output';
import { ListCastMembersInput } from './list-cast-members.input';

export class ListCastMembersUseCase
  implements UseCase<ListCastMembersInput, ListCastMembersOutput>
{
  constructor(private readonly castMemberRepository: CastMemberRepository) {}

  async execute(input: ListCastMembersInput): Promise<ListCastMembersOutput> {
    const params = new CastMemberSearchParams({
      ...(input.page && { page: input.page }),
      ...(input.limit && { limit: input.limit }),
      ...(input.filter && { filter: input.filter }),
      ...(input.sortCriteria && { sortCriteria: input.sortCriteria }),
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

export type ListCastMembersOutput = PaginationOutput<CastMemberOutput>;
