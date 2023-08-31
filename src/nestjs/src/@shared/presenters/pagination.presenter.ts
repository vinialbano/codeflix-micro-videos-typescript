export interface PaginationPresenterProps {
  total: number;
  currentPage: number;
  lastPage: number;
  limit: number;
}

export class PaginationPresenter {
  total: number;
  currentPage: number;
  lastPage: number;
  limit: number;

  constructor(props: PaginationPresenterProps) {
    this.total = props.total;
    this.currentPage = props.currentPage;
    this.lastPage = props.lastPage;
    this.limit = props.limit;
  }
}
