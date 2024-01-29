import { Category } from '@core/category/domain/category.entity';

const _keysInResponse = ['id', 'name', 'description', 'isActive', 'createdAt'];

export class GetCategoryFixture {
  static keysInResponse = _keysInResponse;
}

export class CreateCategoryFixture {
  static keysInResponse = _keysInResponse;

  static arrangeForCreate() {
    const faker = Category.fake()
      .aCategory()
      .withName('Movie')
      .withDescription('Movie description');
    return [
      {
        sentData: {
          name: faker.name,
        },
        expected: {
          name: faker.name,
          description: null,
          isActive: true,
        },
      },
      {
        sentData: {
          name: faker.name,
          description: faker.description,
        },
        expected: {
          name: faker.name,
          description: faker.description,
          isActive: true,
        },
      },
      {
        sentData: {
          name: faker.name,
          description: faker.description,
          isActive: false,
        },
        expected: {
          name: faker.name,
          description: faker.description,
          isActive: false,
        },
      },
      {
        sentData: {
          name: faker.name,
          description: faker.description,
          isActive: true,
        },
        expected: {
          name: faker.name,
          description: faker.description,
          isActive: true,
        },
      },
      {
        sentData: {
          name: faker.name,
          isActive: true,
        },
        expected: {
          name: faker.name,
          description: null,
          isActive: true,
        },
      },
      {
        sentData: {
          name: faker.name,
          isActive: false,
        },
        expected: {
          name: faker.name,
          description: null,
          isActive: false,
        },
      },
    ];
  }

  static arrangeInvalidRequest() {
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      EMPTY: {
        sentData: {},
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_UNDEFINED: {
        sentData: { name: undefined },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_NULL: {
        sentData: { name: null },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_EMPTY: {
        sentData: { name: '' },
        expected: {
          message: ['name should not be empty'],
          ...defaultExpected,
        },
      },
      NAME_NOT_A_STRING: {
        sentData: { name: 1 },
        expected: {
          message: ['name must be a string'],
          ...defaultExpected,
        },
      },
      DESCRIPTION_NOT_A_STRING: {
        sentData: { description: 1 },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'description must be a string',
          ],
          ...defaultExpected,
        },
      },
      IS_ACTIVE_NOT_A_BOOLEAN: {
        sentData: { isActive: 1 },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'isActive must be a boolean value',
          ],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const faker = Category.fake().aCategory();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      NAME_TOO_LONG: {
        sentData: {
          name: faker.withInvalidNameTooLong().name,
        },
        expected: {
          message: ['name must be shorter than or equal to 255 characters'],
          ...defaultExpected,
        },
      },
    };
  }
}

export class UpdateCategoryFixture {
  static keysInResponse = _keysInResponse;

  static arrangeForUpdate() {
    const faker = Category.fake()
      .aCategory()
      .withName('Movie')
      .withDescription('Movie description');
    return [
      {
        sentData: {
          name: faker.name,
        },
        expected: {
          name: faker.name,
        },
      },
      {
        sentData: {
          description: faker.description,
        },
        expected: {
          description: faker.description,
        },
      },
      {
        sentData: {
          isActive: true,
        },
        expected: {
          isActive: true,
        },
      },
      {
        sentData: {
          isActive: false,
        },
        expected: {
          isActive: false,
        },
      },
      {
        sentData: {
          name: faker.name,
          description: faker.description,
        },
        expected: {
          name: faker.name,
          description: faker.description,
        },
      },
      {
        sentData: {
          name: faker.name,
          description: null,
        },
        expected: {
          name: faker.name,
          description: null,
        },
      },
      {
        sentData: {
          name: faker.name,
          isActive: true,
        },
        expected: {
          name: faker.name,
          isActive: true,
        },
      },
      {
        sentData: {
          name: faker.name,
          isActive: false,
        },
        expected: {
          name: faker.name,
          isActive: false,
        },
      },
      {
        sentData: {
          name: faker.name,
          description: null,
          isActive: true,
        },
        expected: {
          name: faker.name,
          description: null,
          isActive: true,
        },
      },
      {
        sentData: {
          name: faker.name,
          description: faker.description,
          isActive: false,
        },
        expected: {
          name: faker.name,
          description: faker.description,
          isActive: false,
        },
      },
    ];
  }

  static arrangeInvalidRequest() {
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      NAME_NOT_A_STRING: {
        sentData: { name: 1 },
        expected: {
          message: ['name must be a string'],
          ...defaultExpected,
        },
      },
      DESCRIPTION_NOT_A_STRING: {
        sentData: { description: 1 },
        expected: {
          message: ['description must be a string'],
          ...defaultExpected,
        },
      },
      IS_ACTIVE_NOT_A_BOOLEAN: {
        sentData: { isActive: 1 },
        expected: {
          message: ['isActive must be a boolean value'],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const faker = Category.fake().aCategory();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      NAME_TOO_LONG: {
        sentData: {
          name: faker.withInvalidNameTooLong().name,
        },
        expected: {
          message: ['name must be shorter than or equal to 255 characters'],
          ...defaultExpected,
        },
      },
    };
  }
}

export class ListCategoriesFixture {
  static arrangeIncrementedWithCreatedAt() {
    const _entities = Category.fake()
      .someCategories(4)
      .withName((i) => `${i}`)
      .withCreatedAt((i) => new Date(new Date().getTime() + i * 2000))
      .build();

    const entitiesMap = {
      first: _entities[0]!,
      second: _entities[1]!,
      third: _entities[2]!,
      fourth: _entities[3]!,
    };

    const arrange = [
      {
        sentData: {},
        expected: {
          entities: [
            entitiesMap.fourth,
            entitiesMap.third,
            entitiesMap.second,
            entitiesMap.first,
          ],
          meta: {
            currentPage: 1,
            lastPage: 1,
            limit: 15,
            total: 4,
          },
        },
      },
      {
        sentData: {
          page: 1,
          limit: 2,
        },
        expected: {
          entities: [entitiesMap.fourth, entitiesMap.third],
          meta: {
            currentPage: 1,
            lastPage: 2,
            limit: 2,
            total: 4,
          },
        },
      },
      {
        sentData: {
          page: 2,
          limit: 2,
        },
        expected: {
          entities: [entitiesMap.second, entitiesMap.first],
          meta: {
            currentPage: 2,
            lastPage: 2,
            limit: 2,
            total: 4,
          },
        },
      },
    ];

    return { arrange, entitiesMap };
  }

  static arrangeUnsorted() {
    const faker = Category.fake().aCategory();

    const entitiesMap = {
      a: faker.withName('a').build(),
      AAA: faker.withName('AAA').build(),
      AaA: faker.withName('AaA').build(),
      b: faker.withName('b').build(),
      c: faker.withName('c').build(),
    };

    const arrange = [
      {
        sentData: {
          page: 1,
          limit: 2,
          sort: 'name',
          filter: 'a',
        },
        expected: {
          entities: [entitiesMap.AAA, entitiesMap.AaA],
          meta: {
            total: 3,
            currentPage: 1,
            lastPage: 2,
            limit: 2,
          },
        },
      },
      {
        sentData: {
          page: 2,
          limit: 2,
          sort: 'name',
          filter: 'a',
        },
        expected: {
          entities: [entitiesMap.a],
          meta: {
            total: 3,
            currentPage: 2,
            lastPage: 2,
            limit: 2,
          },
        },
      },
    ];

    return { arrange, entitiesMap };
  }
}
