import { CastMemberType } from '@core/cast-member/domain/cast-member-type.vo';
import { CastMember } from '@core/cast-member/domain/cast-member.aggregate';
import { CastMemberFilter } from '@core/cast-member/domain/cast-member.repository';
import type {
  SortCriterion,
  SortDirection,
} from '@core/shared/domain/repository/search-params';
import {
  IsIn,
  IsInt,
  IsString,
  ValidateNested,
  validateSync,
} from 'class-validator';

type ListCastMembersInputProps = {
  page?: number;
  limit?: number;
  sortCriteria?: SortCriterion<CastMember> | SortCriterion<CastMember>[];
  filter?: CastMemberFilter;
};

export class ListCastMembersFilter {
  name?: string;

  @IsInt()
  type?: CastMemberType;
}

export class ListCastMembersSort {
  @IsString()
  field!: keyof CastMember;

  @IsIn(['asc', 'desc'])
  @IsString()
  direction?: SortDirection;
}

export class ListCastMembersInput {
  @IsInt()
  page?: number;

  @IsInt()
  type?: number;

  @IsInt()
  limit?: number;

  @ValidateNested()
  filter?: ListCastMembersFilter;

  @ValidateNested()
  sortCriteria?: ListCastMembersSort | ListCastMembersSort[];

  constructor(props: ListCastMembersInputProps) {
    if (!props) {
      return;
    }
    if ('page' in props) {
      this.page = props.page;
    }
    if ('limit' in props) {
      this.limit = props.limit;
    }
    if ('filter' in props) {
      this.filter = props.filter;
    }
    if ('sortCriteria' in props) {
      this.sortCriteria = props.sortCriteria;
    }
  }
}

export class ValidateListCastMembersInput {
  static validate(input: ListCastMembersInput) {
    return validateSync(input);
  }
}
