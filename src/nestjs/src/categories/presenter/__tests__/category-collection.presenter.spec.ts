import { instanceToPlain } from 'class-transformer';
import { PaginationPresenter } from '../../../@shared/presenters/pagination.presenter';
import { CategoryCollectionPresenter } from '../category-collection.presenter';
import { CategoryPresenter } from '../category.presenter';

describe('CategoryCollectionPresenter Unit Tests', () => {
  describe('constructor()', () => {
    it('should set the properties', () => {
      const createdAt = new Date();
      const presenter = new CategoryCollectionPresenter({
        items: [
          {
            id: '123a456b-890c-432a-b101-c234d567e890',
            name: 'Category',
            description: 'Description',
            isActive: true,
            createdAt,
          },
        ],
        total: 1,
        currentPage: 1,
        lastPage: 1,
        limit: 1,
      });
      expect(presenter.meta).toBeInstanceOf(PaginationPresenter);
      expect(presenter.meta).toEqual(
        new PaginationPresenter({
          total: 1,
          currentPage: 1,
          lastPage: 1,
          limit: 1,
        }),
      );
      expect(presenter.data).toStrictEqual([
        new CategoryPresenter({
          id: '123a456b-890c-432a-b101-c234d567e890',
          name: 'Category',
          description: 'Description',
          isActive: true,
          createdAt,
        }),
      ]);
    });
  });

  it('should present the data', () => {
    const createdAt = new Date();
    const presenter = new CategoryCollectionPresenter({
      items: [
        {
          id: '123a456b-890c-432a-b101-c234d567e890',
          name: 'Category',
          description: 'Description',
          isActive: true,
          createdAt,
        },
      ],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      limit: 1,
    });
    const data = instanceToPlain(presenter);
    expect(data).toStrictEqual({
      data: [
        {
          id: '123a456b-890c-432a-b101-c234d567e890',
          name: 'Category',
          description: 'Description',
          isActive: true,
          createdAt: createdAt.toISOString(),
        },
      ],
      meta: {
        total: 1,
        currentPage: 1,
        lastPage: 1,
        limit: 1,
      },
    });
  });
});
