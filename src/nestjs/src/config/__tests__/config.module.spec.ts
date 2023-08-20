import { ZodError } from 'zod';
import { databaseSchema } from '../config.module';

function expectToContainError(
  data: Record<string, unknown>,
  key: string,
  error: string,
) {
  const result = databaseSchema.safeParse(data);
  const formattedError = ((result as any).error as ZodError).format();
  expect(formattedError).toMatchObject({
    [key]: {
      _errors: expect.arrayContaining([error]),
    },
  });
}

describe('ConfigModule Unit Tests', () => {
  describe('Database Schema', () => {
    describe('DB_VENDOR', () => {
      it.each([
        { given: undefined, expected: 'Required' },
        { given: null, expected: "Expected 'mysql' | 'sqlite', received null" },
        {
          given: 'postgresql',
          expected:
            "Invalid enum value. Expected 'mysql' | 'sqlite', received 'postgresql'",
        },
      ])('should be invalid with $given', ({ given, expected }) => {
        expectToContainError({ DB_VENDOR: given }, 'DB_VENDOR', expected);
      });

      it.each(['mysql', 'sqlite'])('should be valid with %p', (given) => {
        const result = databaseSchema.safeParse({ DB_VENDOR: given });
        const formattedError = ((result as any).error as ZodError).format();
        expect(formattedError).not.toMatchObject({
          DB_VENDOR: {},
        });
      });
    });

    describe('DB_HOST', () => {
      it.each([
        { given: undefined, expected: 'Required' },
        { given: null, expected: 'Expected string, received null' },
      ])('should be invalid with $given', ({ given, expected }) => {
        expectToContainError({ DB_HOST: given }, 'DB_HOST', expected);
      });

      it.each([':memory:'])('should be valid with %p', (given) => {
        const result = databaseSchema.safeParse({ DB_HOST: given });
        const formattedError = ((result as any).error as ZodError).format();
        expect(formattedError).not.toMatchObject({
          DB_HOST: {},
        });
      });
    });

    describe('DB_LOGGING', () => {
      it.each([
        { given: undefined, expected: 'Required' },
        { given: null, expected: 'Expected boolean, received null' },
      ])('should be invalid with $given', ({ given, expected }) => {
        expectToContainError({ DB_LOGGING: given }, 'DB_LOGGING', expected);
      });

      it.each([true, false, 'true', 'false'])(
        'should be valid with %p',
        (given) => {
          const result = databaseSchema.safeParse({ DB_LOGGING: given });
          const formattedError = ((result as any).error as ZodError).format();
          expect(formattedError).not.toMatchObject({
            DB_LOGGING: {},
          });
        },
      );
    });

    describe('DB_AUTO_LOAD_MODELS', () => {
      it.each([
        { given: undefined, expected: 'Required' },
        { given: null, expected: 'Expected boolean, received null' },
      ])('should be invalid with $given', ({ given, expected }) => {
        expectToContainError(
          { DB_AUTO_LOAD_MODELS: given },
          'DB_AUTO_LOAD_MODELS',
          expected,
        );
      });

      it.each([true, false, 'true', 'false'])(
        'should be valid with %p',
        (given) => {
          const result = databaseSchema.safeParse({
            DB_AUTO_LOAD_MODELS: given,
          });
          const formattedError = ((result as any).error as ZodError).format();
          expect(formattedError).not.toMatchObject({
            DB_AUTO_LOAD_MODELS: {},
          });
        },
      );
    });

    describe('MySQL Schema', () => {
      describe('DB_PORT', () => {
        it('should not be required if DB_VENDOR is not "mysql"', () => {
          const result = databaseSchema.safeParse({
            DB_VENDOR: 'sqlite',
          });
          const formattedError = ((result as any).error as ZodError).format();
          expect(formattedError).not.toMatchObject({
            DB_PORT: {},
          });
        });

        it.each([
          { given: undefined, expected: 'Required' },
          { given: null, expected: 'Expected number, received null' },
          {
            given: 'a',
            expected: 'Value must be a number or numeric string',
          },
          {
            given: 0,
            expected: 'Number must be greater than 0',
          },
          {
            given: 1.2,
            expected: 'Expected integer, received float',
          },
          {
            given: 65536,
            expected: 'Number must be less than or equal to 65535',
          },
        ])('should be invalid with $given', ({ given, expected }) => {
          expectToContainError(
            { DB_VENDOR: 'mysql', DB_PORT: given },
            'DB_PORT',
            expected,
          );
        });

        it.each([1, '1', 3306, '3306', 65535, '65535'])(
          'should be valid with %p',
          (given) => {
            const result = databaseSchema.safeParse({
              DB_VENDOR: 'mysql',
              DB_PORT: given,
            });
            const formattedError = ((result as any).error as ZodError).format();
            expect(formattedError).not.toMatchObject({
              DB_PORT: {},
            });
          },
        );
      });

      describe('DB_USERNAME', () => {
        it('should not be required if DB_VENDOR is not "mysql"', () => {
          const result = databaseSchema.safeParse({
            DB_VENDOR: 'sqlite',
          });
          const formattedError = ((result as any).error as ZodError).format();
          expect(formattedError).not.toMatchObject({
            DB_USERNAME: {},
          });
        });

        it.each([
          { given: undefined, expected: 'Required' },
          { given: null, expected: 'Expected string, received null' },
          {
            given: '',
            expected: 'String must contain at least 1 character(s)',
          },
          {
            given: ' ',
            expected: 'String must contain at least 1 character(s)',
          },
        ])('should be invalid with $given', ({ given, expected }) => {
          expectToContainError(
            { DB_VENDOR: 'mysql', DB_USERNAME: given },
            'DB_USERNAME',
            expected,
          );
        });

        it.each(['username', 'root'])('should be valid with %p', (given) => {
          const result = databaseSchema.safeParse({
            DB_VENDOR: 'mysql',
            DB_USERNAME: given,
          });
          const formattedError = ((result as any).error as ZodError).format();
          expect(formattedError).not.toMatchObject({
            DB_USERNAME: {},
          });
        });
      });

      describe('DB_PASSWORD', () => {
        it('should not be required if DB_VENDOR is not "mysql"', () => {
          const result = databaseSchema.safeParse({
            DB_VENDOR: 'sqlite',
          });
          const formattedError = ((result as any).error as ZodError).format();
          expect(formattedError).not.toMatchObject({
            DB_PASSWORD: {},
          });
        });

        it.each([
          { given: undefined, expected: 'Required' },
          { given: null, expected: 'Expected string, received null' },
          {
            given: '',
            expected: 'String must contain at least 1 character(s)',
          },
          {
            given: ' ',
            expected: 'String must contain at least 1 character(s)',
          },
        ])('should be invalid with $given', ({ given, expected }) => {
          expectToContainError(
            { DB_VENDOR: 'mysql', DB_PASSWORD: given },
            'DB_PASSWORD',
            expected,
          );
        });

        it.each(['password', 'root'])('should be valid with %p', (given) => {
          const result = databaseSchema.safeParse({
            DB_VENDOR: 'mysql',
            DB_PASSWORD: given,
          });
          const formattedError = ((result as any).error as ZodError).format();
          expect(formattedError).not.toMatchObject({
            DB_PASSWORD: {},
          });
        });
      });

      describe('DB_DATABASE', () => {
        it('should not be required if DB_VENDOR is not "mysql"', () => {
          const result = databaseSchema.safeParse({
            DB_VENDOR: 'sqlite',
          });
          const formattedError = ((result as any).error as ZodError).format();
          expect(formattedError).not.toMatchObject({
            DB_DATABASE: {},
          });
        });

        it.each([
          { given: undefined, expected: 'Required' },
          { given: null, expected: 'Expected string, received null' },
          {
            given: '',
            expected: 'String must contain at least 1 character(s)',
          },
          {
            given: ' ',
            expected: 'String must contain at least 1 character(s)',
          },
        ])('should be invalid with $given', ({ given, expected }) => {
          expectToContainError(
            { DB_VENDOR: 'mysql', DB_DATABASE: given },
            'DB_DATABASE',
            expected,
          );
        });

        it.each(['database', 'root'])('should be valid with %p', (given) => {
          const result = databaseSchema.safeParse({
            DB_VENDOR: 'mysql',
            DB_DATABASE: given,
          });
          const formattedError = ((result as any).error as ZodError).format();
          expect(formattedError).not.toMatchObject({
            DB_DATABASE: {},
          });
        });
      });
    });
    describe('SQLite Schema', () => {
      describe('DB_FILENAME', () => {
        it('should not be required if DB_VENDOR is not "sqlite"', () => {
          const result = databaseSchema.safeParse({
            DB_VENDOR: 'mysql',
          });
          const formattedError = ((result as any).error as ZodError).format();
          expect(formattedError).not.toMatchObject({
            DB_FILENAME: {},
          });
        });

        it.each([
          { given: null, expected: 'Expected string, received null' },
          {
            given: '',
            expected: 'String must contain at least 1 character(s)',
          },
          {
            given: ' ',
            expected: 'String must contain at least 1 character(s)',
          },
        ])('should be invalid with $given', ({ given, expected }) => {
          expectToContainError(
            { DB_VENDOR: 'sqlite', DB_FILENAME: given },
            'DB_FILENAME',
            expected,
          );
        });

        it.each(['file.sqlite', './db.sqlite', undefined])(
          'should be valid with %p',
          (given) => {
            const result = databaseSchema.safeParse({
              DB_VENDOR: 'sqlite',
              FILENAME: given,
            });
            const formattedError = ((result as any).error as ZodError).format();
            expect(formattedError).not.toMatchObject({
              FILENAME: {},
            });
          },
        );
      });
    });
  });
});
