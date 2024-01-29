import { Transform } from 'class-transformer';

export type PaginationPresenterProps = {
  currentPage: number;
  limit: number;
  lastPage: number;
  total: number;
};

export class PaginationPresenter {
  @Transform(({ value }) => parseInt(value))
  currentPage: number;

  @Transform(({ value }) => parseInt(value))
  limit: number;

  @Transform(({ value }) => parseInt(value))
  lastPage: number;

  @Transform(({ value }) => parseInt(value))
  total: number;

  constructor(props: PaginationPresenterProps) {
    this.currentPage = props.currentPage;
    this.limit = props.limit;
    this.lastPage = props.lastPage;
    this.total = props.total;
  }
}
