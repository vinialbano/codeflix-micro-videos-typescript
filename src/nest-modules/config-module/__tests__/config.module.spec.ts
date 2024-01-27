import { ConfigModule, CONFIG_DB_SCHEMA } from '../config.module';
import * as Joi from 'joi';
import { Test, TestingModule } from '@nestjs/testing';
import { join } from 'path';

function expectValidate(schema: Joi.ObjectSchema, value: any) {
  return expect(schema.validate(value, { abortEarly: false }).error?.message);
}

describe('Schema Unit Tests', () => {
  describe('DB_SCHEMA', () => {
    const schema = Joi.object({
      ...CONFIG_DB_SCHEMA,
    });

    describe('DB_VENDOR', () => {
      test('invalid cases', () => {
        expectValidate(schema, {}).toContain('"DB_VENDOR" is required');
        expectValidate(schema, { DB_VENDOR: 'postgres' }).toContain(
          '"DB_VENDOR" must be one of [mysql, sqlite]',
        );
      });

      test('valid cases', () => {
        const arrange = ['mysql', 'sqlite'];
        arrange.forEach((value) => {
          expectValidate(schema, { DB_VENDOR: value }).not.toContain(
            'DB_VENDOR',
          );
        });
      });
    });

    describe('DB_HOST', () => {
      test('invalid cases', () => {
        expectValidate(schema, {}).toContain('"DB_HOST" is required');
        expectValidate(schema, { DB_HOST: 1 }).toContain(
          '"DB_HOST" must be a string',
        );
      });

      test('valid cases', () => {
        const arrange = ['localhost'];
        arrange.forEach((value) => {
          expectValidate(schema, { DB_HOST: value }).not.toContain('DB_HOST');
        });
      });
    });

    describe('DB_DATABASE', () => {
      test('invalid cases', () => {
        expectValidate(schema, { DB_VENDOR: 'mysql' }).toContain(
          '"DB_DATABASE" is required',
        );
        expectValidate(schema, { DB_DATABASE: 1 }).toContain(
          '"DB_DATABASE" must be a string',
        );
      });

      test('valid cases', () => {
        const arrange = [
          { DB_VENDOR: 'mysql', DB_DATABASE: 'test' },
          { DB_VENDOR: 'sqlite', DB_DATABASE: 'test' },
          { DB_VENDOR: 'sqlite' },
        ];
        arrange.forEach((value) => {
          expectValidate(schema, value).not.toContain('DB_DATABASE');
        });
        expectValidate(schema, { DB_VENDOR: 'sqlite' }).not.toContain(
          '"DB_DATABASE" is required',
        );
      });
    });

    describe('DB_USERNAME', () => {
      test('invalid cases', () => {
        expectValidate(schema, { DB_VENDOR: 'mysql' }).toContain(
          '"DB_USERNAME" is required',
        );
        expectValidate(schema, { DB_USERNAME: 1 }).toContain(
          '"DB_USERNAME" must be a string',
        );
      });

      test('valid cases', () => {
        const arrange = [
          { DB_VENDOR: 'mysql', DB_USERNAME: 'test' },
          { DB_VENDOR: 'sqlite', DB_USERNAME: 'test' },
          { DB_VENDOR: 'sqlite' },
        ];
        arrange.forEach((value) => {
          expectValidate(schema, value).not.toContain('DB_USERNAME');
        });
        expectValidate(schema, { DB_HOST: 'sqlite' }).not.toContain(
          '"DB_USERNAME" is required',
        );
      });
    });

    describe('DB_PASSWORD', () => {
      test('invalid cases', () => {
        expectValidate(schema, { DB_VENDOR: 'mysql' }).toContain(
          '"DB_PASSWORD" is required',
        );
        expectValidate(schema, { DB_PASSWORD: 1 }).toContain(
          '"DB_PASSWORD" must be a string',
        );
      });

      test('valid cases', () => {
        const arrange = [
          { DB_VENDOR: 'mysql', DB_PASSWORD: 'test' },
          { DB_VENDOR: 'sqlite', DB_PASSWORD: 'test' },
          { DB_VENDOR: 'sqlite' },
        ];
        arrange.forEach((value) => {
          expectValidate(schema, value).not.toContain('DB_PASSWORD');
        });
        expectValidate(schema, { DB_VENDOR: 'sqlite' }).not.toContain(
          '"DB_PASSWORD" is required',
        );
      });
    });

    describe('DB_PORT', () => {
      test('invalid cases', () => {
        expectValidate(schema, { DB_VENDOR: 'mysql' }).toContain(
          '"DB_PORT" is required',
        );
        expectValidate(schema, { DB_PORT: 'test' }).toContain(
          '"DB_PORT" must be a number',
        );
      });

      test('valid cases', () => {
        const arrange = [
          { DB_HOST: 'mysql', DB_PORT: 1 },
          { DB_HOST: 'sqlite', DB_PORT: 1 },
          { DB_HOST: 'sqlite' },
        ];
        arrange.forEach((value) => {
          expectValidate(schema, value).not.toContain('DB_PORT');
        });
        expectValidate(schema, { DB_HOST: 'sqlite' }).not.toContain(
          '"DB_PORT" is required',
        );
      });
    });

    describe('DB_LOGGING', () => {
      test('invalid cases', () => {
        expectValidate(schema, {}).toContain('"DB_LOGGING" is required');
        expectValidate(schema, { DB_LOGGING: 'test' }).toContain(
          '"DB_LOGGING" must be a boolean',
        );
      });

      test('valid cases', () => {
        const arrange = [true, false];
        arrange.forEach((value) => {
          expectValidate(schema, { DB_LOGGING: value }).not.toContain(
            'DB_LOGGING',
          );
        });
      });
    });

    describe('DB_AUTO_LOAD_MODELS', () => {
      test('invalid cases', () => {
        expectValidate(schema, {}).toContain(
          '"DB_AUTO_LOAD_MODELS" is required',
        );
        expectValidate(schema, { DB_AUTO_LOAD_MODELS: 'test' }).toContain(
          '"DB_AUTO_LOAD_MODELS" must be a boolean',
        );
      });

      test('valid cases', () => {
        const arrange = [true, false];
        arrange.forEach((value) => {
          expectValidate(schema, { DB_AUTO_LOAD_MODELS: value }).not.toContain(
            'DB_AUTO_LOAD_MODELS',
          );
        });
      });
    });
  });
});

describe('ConfigModule Unit Tests', () => {
  it('should throw an error when env vars are invalid', () => {
    try {
      Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            envFilePath: join(__dirname, `.env.fake`),
          }),
        ],
      });
      fail('ConfigModule should throw na error when env vars are invalid');
    } catch (error) {
      expect((error as Error).message).toContain(
        '"DB_VENDOR" must be one of [mysql, sqlite]',
      );
    }
  });

  it('should be defined', () => {
    const module = Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
    });
    expect(module).toBeDefined();
  });
});
