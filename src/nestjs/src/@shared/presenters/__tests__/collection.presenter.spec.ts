import { Expose, instanceToPlain } from 'class-transformer';
import { CollectionPresenter } from '../collection.presenter';
import { PaginationPresenter } from '../pagination.presenter';

class StubCollectionPresenter extends CollectionPresenter {
  @Expose({ name: 'data' })
  get data() {
    return [1, 2, 3];
  }
}

describe('CollectionPresenter Unit Tests', () => {
  describe('constructor()', () => {
    it('should set the properties', () => {
      const props = {
        total: 1,
        currentPage: 1,
        lastPage: 1,
        limit: 1,
      };
      const presenter = new StubCollectionPresenter(props);
      expect(presenter['paginationPresenter']).toBeInstanceOf(
        PaginationPresenter,
      );
      expect(presenter['paginationPresenter'].total).toBe(props.total);
      expect(presenter['paginationPresenter'].currentPage).toBe(
        props.currentPage,
      );
      expect(presenter['paginationPresenter'].lastPage).toBe(props.lastPage);
      expect(presenter['paginationPresenter'].limit).toBe(props.limit);
      expect(presenter.meta).toEqual(presenter['paginationPresenter']);
    });
  });

  it('should present the data', () => {
    const props = {
      total: 1,
      currentPage: 1,
      lastPage: 1,
      limit: 1,
    };
    const presenter = new StubCollectionPresenter(props);
    const data = instanceToPlain(presenter);
    expect(data).toStrictEqual({
      data: [1, 2, 3],
      meta: {
        total: 1,
        currentPage: 1,
        lastPage: 1,
        limit: 1,
      },
    });
  });
});
