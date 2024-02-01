import { SearchParams } from '../search-params';

describe('SearchParams Unit Tests', () => {
  describe('constructor()', () => {
    it('should create a SearchParams instance with default values', () => {
      const searchParams = new SearchParams();
      expect(searchParams.page).toBe(1);
      expect(searchParams.limit).toBe(15);
      expect(searchParams.sortCriteria).toBeNull();
      expect(searchParams.filter).toBeNull();
    });

    const pageTestCases = [
      { given: undefined, expected: 1 },
      { given: null, expected: 1 },
      { given: '', expected: 1 },
      { given: 'page', expected: 1 },
      { given: '1', expected: 1 },
      { given: '1.1', expected: 1 },
      { given: 0, expected: 1 },
      { given: -1, expected: 1 },
      { given: 2.1, expected: 1 },
      { given: true, expected: 1 },
      { given: false, expected: 1 },
      { given: 2, expected: 2 },
      { given: '2', expected: 2 },
    ];
    it.each(pageTestCases)(
      'should create a SearchParams instance with page = $expected, given $given',
      ({ given, expected }) => {
        const searchParams = new SearchParams({ page: given as any });
        expect(searchParams.page).toBe(expected);
      },
    );

    const limitTestCases = [
      { given: undefined, expected: 15 },
      { given: null, expected: 15 },
      { given: '', expected: 15 },
      { given: 'limit', expected: 15 },
      { given: '1.1', expected: 15 },
      { given: 0, expected: 15 },
      { given: -1, expected: 15 },
      { given: 2.1, expected: 15 },
      { given: true, expected: 15 },
      { given: false, expected: 15 },
      { given: 1, expected: 1 },
      { given: 2, expected: 2 },
      { given: '2', expected: 2 },
    ];
    it.each(limitTestCases)(
      'should create a SearchParams instance with limit = $expected, given $given',
      ({ given, expected }) => {
        const searchParams = new SearchParams({ limit: given as any });
        expect(searchParams.limit).toBe(expected);
      },
    );

    const sortTestCases = [
      { given: undefined, expected: null },
      { given: null, expected: null },
      { given: '', expected: null },
      { given: 'sort', expected: null },
      { given: 1, expected: null },
      { given: 1.1, expected: null },
      { given: true, expected: null },
      { given: false, expected: null },
      {
        given: { field: null },
        expected: null,
      },
      {
        given: { field: 1 },
        expected: null,
      },
      {
        given: { field: 'field1' },
        expected: { field: 'field1', direction: 'asc' },
      },
      {
        given: { field: 'field1', direction: null },
        expected: { field: 'field1', direction: 'asc' },
      },
      {
        given: { field: 'field1', direction: '' },
        expected: { field: 'field1', direction: 'asc' },
      },
      {
        given: { field: 'field1', direction: 1 },
        expected: { field: 'field1', direction: 'asc' },
      },
      {
        given: { field: 'field1', direction: 0 },
        expected: { field: 'field1', direction: 'asc' },
      },
      {
        given: { field: 'field1', direction: 'any-text' },
        expected: { field: 'field1', direction: 'asc' },
      },
      {
        given: { field: 'field1', direction: 'desc' },
        expected: { field: 'field1', direction: 'desc' },
      },
      {
        given: { field: 'field1', direction: 'DESC' },
        expected: { field: 'field1', direction: 'desc' },
      },
      {
        given: { field: 'field1', transform: null },
        expected: { field: 'field1', direction: 'asc' },
      },
      {
        given: { field: 'field1', transform: 1 },
        expected: { field: 'field1', direction: 'asc' },
      },
      {
        given: { field: 'field1', transform: 'not-function' },
        expected: { field: 'field1', direction: 'asc' },
      },
      {
        given: { field: 'field1', transform: () => 'custom' },
        expected: {
          field: 'field1',
          direction: 'asc',
          transform: expect.any(Function),
        },
      },
      {
        given: {
          field: 'field1',
          direction: 'desc',
          transform: () => 'custom',
        },
        expected: {
          field: 'field1',
          direction: 'desc',
          transform: expect.any(Function),
        },
      },
      {
        given: [],
        expected: null,
      },
      {
        given: [
          {
            field: 'field1',
            direction: 'desc',
            transform: () => 'custom',
          },
        ],
        expected: {
          field: 'field1',
          direction: 'desc',
          transform: expect.any(Function),
        },
      },
      {
        given: [
          {
            field: 'field1',
            direction: 'desc',
            transform: () => 'custom',
          },
          {
            field: 'field2',
          },
        ],
        expected: [
          {
            field: 'field1',
            direction: 'desc',
            transform: expect.any(Function),
          },
          {
            field: 'field2',
            direction: 'asc',
          },
        ],
      },
      {
        given: [
          {
            field: 'field1',
            direction: 'desc',
            transform: () => 'custom',
          },
          null,
          1,
          'anything',
          {
            field: 'field2',
          },
        ],
        expected: [
          {
            field: 'field1',
            direction: 'desc',
            transform: expect.any(Function),
          },
          {
            field: 'field2',
            direction: 'asc',
          },
        ],
      },
    ];
    it.each(sortTestCases)(
      'should create a SearchParams instance with sortCriteria = $expected, given $given',
      ({ given, expected }) => {
        const searchParams = new SearchParams({ sortCriteria: given as any });
        expect(searchParams.sortCriteria).toEqual(expected);
      },
    );

    const filterTestCases = [
      { given: undefined, expected: null },
      { given: null, expected: null },
      { given: '', expected: null },
      { given: 'filter', expected: 'filter' },
      { given: 1, expected: '1' },
      { given: 1.1, expected: '1.1' },
      { given: true, expected: 'true' },
      { given: false, expected: 'false' },
    ];
    it.each(filterTestCases)(
      'should create a SearchParams instance with filter = $expected, given $given',
      ({ given, expected }) => {
        const searchParams = new SearchParams({ filter: given as any });
        expect(searchParams.filter).toBe(expected);
      },
    );
  });
});
