import { instanceToPlain } from 'class-transformer';
import { CollectionPresenter } from '../collection.presenter';
import { PaginationPresenter } from '../pagination.presenter';

class StubCollectionPresenter extends CollectionPresenter {
  data = [1, 2, 3];
}

describe('CollectionPresenter Unit Tests', () => {
  describe('constructor()', () => {
    it('should set values', () => {
      const presenter = new StubCollectionPresenter({
        currentPage: 1,
        limit: 2,
        lastPage: 3,
        total: 6,
      });

      expect(presenter['paginationPresenter']).toBeInstanceOf(
        PaginationPresenter,
      );
      expect(presenter['paginationPresenter'].currentPage).toBe(1);
      expect(presenter['paginationPresenter'].limit).toBe(2);
      expect(presenter['paginationPresenter'].lastPage).toBe(3);
      expect(presenter['paginationPresenter'].total).toBe(6);
      expect(presenter.meta).toEqual(presenter['paginationPresenter']);
    });

    it('should format data', () => {
      const presenter = new StubCollectionPresenter({
        currentPage: 1,
        limit: 2,
        lastPage: 3,
        total: 6,
      });

      expect(instanceToPlain(presenter)).toStrictEqual({
        data: [1, 2, 3],
        meta: {
          currentPage: 1,
          limit: 2,
          lastPage: 3,
          total: 6,
        },
      });
    });
  });
});
