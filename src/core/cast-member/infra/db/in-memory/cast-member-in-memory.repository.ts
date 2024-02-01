import { SortCriterion } from '@core/shared/domain/repository/search-params';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory-searchable.repository';
import {
  CastMember,
  CastMemberId,
} from '../../../domain/cast-member.aggregate';
import {
  CastMemberFilter,
  CastMemberRepository,
} from '../../../domain/cast-member.repository';

export class CastMemberInMemoryRepository
  extends InMemorySearchableRepository<CastMember, CastMemberId>
  implements CastMemberRepository
{
  sortableFields: string[] = ['name', 'type', 'createdAt'];

  getEntity() {
    return CastMember;
  }

  protected async applyFilter(
    items: CastMember[],
    filter: CastMemberFilter | null,
  ): Promise<CastMember[]> {
    if (!filter) {
      return items;
    }
    return items.filter((item) =>
      item.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  protected applySort(
    items: CastMember[],
    sortCriteria?:
      | SortCriterion<CastMember>
      | SortCriterion<CastMember>[]
      | null,
  ): CastMember[] {
    return sortCriteria
      ? super.applySort(items, sortCriteria)
      : super.applySort(items, {
          field: 'createdAt',
          direction: 'desc',
        });
  }
}
