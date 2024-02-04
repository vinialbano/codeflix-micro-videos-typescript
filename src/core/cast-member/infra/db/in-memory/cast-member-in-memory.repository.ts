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
  extends InMemorySearchableRepository<
    CastMember,
    CastMemberId,
    CastMemberFilter
  >
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
    return items
      .filter((item) => {
        if ('name' in filter) {
          return item.name.toLowerCase().includes(filter.name.toLowerCase());
        }
        return true;
      })
      .filter((item) => {
        if ('type' in filter) {
          return item.type.equals(filter.type);
        }
        return true;
      });
  }

  protected applySort(
    items: CastMember[],
    sortCriteria: SortCriterion<CastMember> | SortCriterion<CastMember>[] = [],
  ): CastMember[] {
    return !Array.isArray(sortCriteria) || sortCriteria.length
      ? super.applySort(items, sortCriteria)
      : super.applySort(items, {
          field: 'createdAt',
          direction: 'desc',
        });
  }
}
