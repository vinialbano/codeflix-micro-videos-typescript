import { instanceToPlain } from 'class-transformer';
import { PaginationPresenter } from '../pagination.presenter';

describe('PaginationPresenter Unit Tests', () => {
  describe('constructor()', () => {
    it('should set values', () => {
      const presenter = new PaginationPresenter({
        currentPage: 1,
        limit: 2,
        lastPage: 3,
        total: 6,
      });

      expect(presenter.currentPage).toBe(1);
      expect(presenter.limit).toBe(2);
      expect(presenter.lastPage).toBe(3);
      expect(presenter.total).toBe(6);
    });

    it('should set string number values', () => {
      const presenter = new PaginationPresenter({
        currentPage: '1' as any,
        limit: '2' as any,
        lastPage: '3' as any,
        total: '6' as any,
      });

      expect(presenter.currentPage).toBe('1');
      expect(presenter.limit).toBe('2');
      expect(presenter.lastPage).toBe('3');
      expect(presenter.total).toBe('6');
    });
  });

  const arrange = [
    {
      currentPage: 1,
      limit: 2,
      lastPage: 3,
      total: 6,
    },
    {
      currentPage: '1' as any,
      limit: '2' as any,
      lastPage: '3' as any,
      total: '6' as any,
    },
  ];
  it.each(arrange)('should format data', (input) => {
    const presenter = new PaginationPresenter(input);

    expect(instanceToPlain(presenter)).toStrictEqual({
      currentPage: 1,
      limit: 2,
      lastPage: 3,
      total: 6,
    });
  });
});
