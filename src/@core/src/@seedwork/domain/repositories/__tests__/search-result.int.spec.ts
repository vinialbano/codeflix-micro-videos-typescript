import { Entity, SearchResult, SearchResultProps } from '#seedwork/domain';

class StubEntity extends Entity<{ prop: string }> {}
class WrongStubEntity extends Entity<{ prop: number }> {}

const validProps: SearchResultProps<StubEntity> = {
  items: [new StubEntity({ prop: '' })],
  total: 1,
  currentPage: 1,
  limit: 1,
  sort: 'prop',
  order: 'asc',
  filter: 'prop',
};

describe('SearchResult Integration Tests', () => {
  describe('constructor()', () => {
    it('should contain error if items validation fails', () => {
      const arrange: any[] = [
        {
          given: undefined,
          expected: { _errors: ['Required'] },
        },
        {
          given: null,
          expected: { _errors: ['Expected array, received null'] },
        },
        {
          given: [new WrongStubEntity({ prop: 0 })],
          expected: { '0': { _errors: ['Input not instance of StubEntity'] } },
        },
      ];
      arrange.forEach(({ given, expected }) => {
        expect(
          () =>
            new SearchResult<StubEntity>(
              { ...validProps, items: given } as any,
              StubEntity,
            ),
        ).toContainErrorMessages({
          items: expected,
        });
      });
    });

    it('should not contain error if items validation passes', () => {
      expect(
        () =>
          new SearchResult<StubEntity>(
            { ...validProps, items: [new StubEntity({ prop: '' })] } as any,
            StubEntity,
          ),
      ).not.toContainErrorMessages({});
    });

    it('should contain error if total validation fails', () => {
      const arrange: any[] = [
        {
          given: undefined,
          expected: { _errors: ['Required'] },
        },
        {
          given: null,
          expected: { _errors: ['Expected number, received null'] },
        },
        {
          given: 1.5,
          expected: { _errors: ['Expected integer, received float'] },
        },
        {
          given: -1,
          expected: { _errors: ['Number must be greater than or equal to 0'] },
        },
      ];
      arrange.forEach(({ given, expected }) => {
        expect(
          () =>
            new SearchResult<StubEntity>(
              { ...validProps, total: given } as any,
              StubEntity,
            ),
        ).toContainErrorMessages({
          total: expected,
        });
      });
    });

    it('should not contain error if total validation passes', () => {
      const arrange = [0, 1, 2];
      arrange.forEach((given) => {
        expect(
          () =>
            new SearchResult<StubEntity>(
              { ...validProps, total: given } as any,
              StubEntity,
            ),
        ).not.toContainErrorMessages({});
      });
    });

    it('should contain error if currentPage validation fails', () => {
      const arrange: any[] = [
        {
          given: undefined,
          expected: { _errors: ['Required'] },
        },
        {
          given: null,
          expected: { _errors: ['Expected number, received null'] },
        },
        {
          given: 1.5,
          expected: { _errors: ['Expected integer, received float'] },
        },
        {
          given: -1,
          expected: { _errors: ['Number must be greater than or equal to 1'] },
        },
      ];
      arrange.forEach(({ given, expected }) => {
        expect(
          () =>
            new SearchResult<StubEntity>(
              { ...validProps, currentPage: given } as any,
              StubEntity,
            ),
        ).toContainErrorMessages({
          currentPage: expected,
        });
      });
    });

    it('should not contain error if currentPage validation passes', () => {
      const arrange = [1, 2];
      arrange.forEach((given) => {
        expect(
          () =>
            new SearchResult<StubEntity>(
              { ...validProps, currentPage: given } as any,
              StubEntity,
            ),
        ).not.toContainErrorMessages({});
      });
    });

    it('should contain error if limit validation fails', () => {
      const arrange: any[] = [
        {
          given: undefined,
          expected: { _errors: ['Required'] },
        },
        {
          given: null,
          expected: { _errors: ['Expected number, received null'] },
        },
        {
          given: 1.5,
          expected: { _errors: ['Expected integer, received float'] },
        },
        {
          given: -1,
          expected: { _errors: ['Number must be greater than or equal to 1'] },
        },
      ];
      arrange.forEach(({ given, expected }) => {
        expect(
          () =>
            new SearchResult<StubEntity>(
              { ...validProps, limit: given } as any,
              StubEntity,
            ),
        ).toContainErrorMessages({
          limit: expected,
        });
      });
    });

    it('should not contain error if limit validation passes', () => {
      const arrange = [1, 2];
      arrange.forEach((given) => {
        expect(
          () =>
            new SearchResult<StubEntity>(
              { ...validProps, limit: given } as any,
              StubEntity,
            ),
        ).not.toContainErrorMessages({});
      });
    });

    it('should contain error if sort validation fails', () => {
      const arrange: any[] = [
        {
          given: undefined,
          expected: { _errors: ['Required'] },
        },
        {
          given: 1,
          expected: { _errors: ['Expected string, received number'] },
        },
        {
          given: ' ',
          expected: {
            _errors: ['String must contain at least 1 character(s)'],
          },
        },
      ];
      arrange.forEach(({ given, expected }) => {
        expect(
          () =>
            new SearchResult<StubEntity>(
              { ...validProps, sort: given } as any,
              StubEntity,
            ),
        ).toContainErrorMessages({
          sort: expected,
        });
      });
    });

    it('should not contain error if sort validation passes', () => {
      const arrange: any[] = [
        { sort: null, order: null },
        { sort: 'prop', order: 'asc' },
      ];
      arrange.forEach(({ given, expected }) => {
        expect(
          () =>
            new SearchResult<StubEntity>(
              { ...validProps, ...given },
              StubEntity,
            ),
        ).not.toContainErrorMessages({});
      });
    });

    it('should contain error if order validation fails', () => {
      const arrange: any[] = [
        {
          given: { order: undefined },
          expected: { _errors: ['Required'] },
        },
        {
          given: { order: 1 },
          expected: { _errors: ['Expected string, received number'] },
        },
        {
          given: { order: ' ' },
          expected: {
            _errors: ["Must be 'asc' or 'desc'"],
          },
        },
        {
          given: { sort: 'prop', order: null },
          expected: {
            _errors: ['Required if sort is provided'],
          },
        },
        {
          given: { sort: null, order: 'asc' },
          expected: {
            _errors: ['Must be null if sort is not provided'],
          },
        },
        {
          given: { sort: null, order: 'desc' },
          expected: {
            _errors: ['Must be null if sort is not provided'],
          },
        },
      ];
      arrange.forEach(({ given, expected }) => {
        expect(
          () =>
            new SearchResult<StubEntity>(
              { ...validProps, ...given },
              StubEntity,
            ),
        ).toContainErrorMessages({});
      });
    });

    it('should not contain error if order validation passes', () => {
      const arrange: any[] = [
        { order: null, sort: null },
        { order: 'asc', sort: 'prop' },
        { order: 'desc', sort: 'prop' },
      ];
      arrange.forEach(({ given, expected }) => {
        expect(
          () =>
            new SearchResult<StubEntity>(
              { ...validProps, ...given },
              StubEntity,
            ),
        ).not.toContainErrorMessages({});
      });
    });

    it('should contain error if filter validation fails', () => {
      const arrange: any[] = [
        {
          given: undefined,
          expected: { _errors: ['Required'] },
        },
        {
          given: 1,
          expected: { _errors: ['Expected string, received number'] },
        },
        {
          given: ' ',
          expected: {
            _errors: ['String must contain at least 1 character(s)'],
          },
        },
      ];
      arrange.forEach(({ given, expected }) => {
        expect(
          () =>
            new SearchResult<StubEntity>(
              { ...validProps, filter: given } as any,
              StubEntity,
            ),
        ).toContainErrorMessages({
          filter: expected,
        });
      });
    });

    it('should not contain error if filter validation passes', () => {
      const arrange = ['prop', null];
      arrange.forEach((given) => {
        expect(
          () =>
            new SearchResult<StubEntity>(
              { ...validProps, filter: given } as any,
              StubEntity,
            ),
        ).not.toContainErrorMessages({});
      });
    });
  });
});
