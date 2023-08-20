import { CategoryModel } from '@codeflix/micro-videos/category/infra';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import {
  ConfigSchema,
  MySQLSchema,
  SQLiteSchema,
} from '../config/config.module';

function getSQLiteConfig(config: ConfigService<SQLiteSchema>, models: any[]) {
  return {
    dialect: 'sqlite' as const,
    host: config.get('DB_HOST'),
    filename: config.get('DB_FILENAME'),
    logging: config.get('DB_LOGGING'),
    autoLoadModels: config.get('DB_AUTO_LOAD_MODELS'),
    models,
  };
}

function getMySQLConfig(config: ConfigService<MySQLSchema>, models: any[]) {
  return {
    dialect: 'mysql' as const,
    host: config.get('DB_HOST'),
    database: config.get('DB_DATABASE'),
    username: config.get('DB_USERNAME'),
    password: config.get('DB_PASSWORD'),
    port: config.get('DB_PORT'),
    models,
    autoLoadModels: config.get('DB_AUTO_LOAD_MODELS'),
    logging: config.get('DB_LOGGING'),
  };
}

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: async (config: ConfigService<ConfigSchema>) => {
        const models = [CategoryModel];
        if (config.get('DB_VENDOR') === 'sqlite') {
          return getSQLiteConfig(config, models);
        }
        if (config.get('DB_VENDOR') === 'mysql') {
          return getMySQLConfig(config, models);
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
