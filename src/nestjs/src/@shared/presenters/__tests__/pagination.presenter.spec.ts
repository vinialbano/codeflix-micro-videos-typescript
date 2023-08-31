import { instanceToPlain } from 'class-transformer';
import { PaginationPresenter } from '../pagination.presenter';

describe('PaginationPresenter Unit Tests', () => {
  describe('constructor()', () => {
    it('should set the properties', () => {
      const props = {
        total: 1,
        currentPage: 1,
        lastPage: 1,
        limit: 1,
      };
      const presenter = new PaginationPresenter(props);
      expect(presenter.total).toBe(props.total);
      expect(presenter.currentPage).toBe(props.currentPage);
      expect(presenter.lastPage).toBe(props.lastPage);
      expect(presenter.limit).toBe(props.limit);
    });
  });

  it('should present the data', () => {
    const props = {
      total: 1,
      currentPage: 1,
      lastPage: 1,
      limit: 1,
    };
    const presenter = new PaginationPresenter(props);
    const data = instanceToPlain(presenter);
    expect(data).toStrictEqual({
      total: props.total,
      currentPage: props.currentPage,
      lastPage: props.lastPage,
      limit: props.limit,
    });
  });
});
