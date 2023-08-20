import { DynamicModule, Module } from '@nestjs/common';
import {
  ConfigModuleOptions,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import { join } from 'path';
import { ZodError, z } from 'zod';

const mysqlSchema = z.object({
  DB_VENDOR: z.enum(['mysql']),
  DB_PORT: z
    .union([
      z.string().regex(/\d+/, 'Value must be a number or numeric string'),
      z.number(),
    ])
    .pipe(z.coerce.number().int().positive().max(65535)),
  DB_USERNAME: z.string().trim().min(1),
  DB_PASSWORD: z.string().trim().min(1),
  DB_DATABASE: z.string().trim().min(1),
});

const sqliteSchema = z.object({
  DB_VENDOR: z.enum(['sqlite']),
  DB_FILENAME: z.string().trim().min(1).optional(),
});

export const databaseBaseSchema = z.object({
  DB_VENDOR: z.enum(['mysql', 'sqlite']),
  DB_HOST: z.string().trim().min(1),
  DB_LOGGING: z.boolean().or(z.enum(['true', 'false'])),
  DB_AUTO_LOAD_MODELS: z.boolean().or(z.enum(['true', 'false'])),
});

export const databaseSchema = databaseBaseSchema.and(
  z.discriminatedUnion('DB_VENDOR', [mysqlSchema, sqliteSchema]),
);
export const configSchema = databaseSchema;

@Module({})
export class ConfigModule extends NestConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    const { envFilePath, ...otherOptions } = options;
    return super.forRoot({
      isGlobal: true,
      envFilePath: [
        ...(Array.isArray(envFilePath) ? envFilePath : [envFilePath]),
        join(__dirname, `../envs/.env.${process.env.NODE_ENV}`),
        join(__dirname, '../envs/.env'),
      ],
      validate(config) {
        try {
          return configSchema.parse(config);
        } catch (error) {
          throw (error as ZodError).format();
        }
      },
      ...otherOptions,
    });
  }
}

export type ConfigSchema = z.infer<typeof configSchema>;
export type DatabaseBaseSchema = z.infer<typeof databaseBaseSchema>;
export type MySQLSchema = z.infer<typeof mysqlSchema> & DatabaseBaseSchema;
export type SQLiteSchema = z.infer<typeof sqliteSchema> & DatabaseBaseSchema;
