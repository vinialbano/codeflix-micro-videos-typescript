import { Test } from '@nestjs/testing';
import { DatabaseModule } from '../database.module';
import { ConfigModule } from '../../config-module/config.module';
import { Sequelize } from 'sequelize-typescript';
import { getConnectionToken } from '@nestjs/sequelize';

describe('DatabaseModule Unit Tests', () => {
  describe('sqlite connection', () => {
    const connectionOptions = {
      DB_VENDOR: 'sqlite',
      DB_HOST: ':memory:',
      DB_LOGGING: false,
      DB_AUTO_LOAD_MODELS: true,
    };

    it('should be a sqlite connection', async () => {
      const module = await Test.createTestingModule({
        imports: [
          DatabaseModule,
          ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            ignoreEnvVars: true,
            validationSchema: null,
            load: [() => connectionOptions],
          }),
        ],
      }).compile();

      const app = module.createNestApplication();
      const connection = app.get<Sequelize>(getConnectionToken());
      expect(connection).toBeDefined();
      expect(connection.getDialect()).toBe('sqlite');
      expect(connection.options.host).toBe(':memory:');
      await connection.close();
    });
  });

  describe('mysql connection', () => {
    const connectionOptions = {
      DB_VENDOR: 'mysql',
      DB_HOST: 'db',
      DB_PORT: 3306,
      DB_USERNAME: 'root',
      DB_PASSWORD: 'root',
      DB_DATABASE: 'micro_videos',
      DB_LOGGING: false,
      DB_AUTO_LOAD_MODELS: true,
    };

    it('should be a mysql connection', async () => {
      const module = await Test.createTestingModule({
        imports: [
          DatabaseModule,
          ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            ignoreEnvVars: true,
            validationSchema: null,
            load: [() => connectionOptions],
          }),
        ],
      }).compile();

      const app = module.createNestApplication();
      const connection = app.get<Sequelize>(getConnectionToken());
      expect(connection).toBeDefined();
      expect(connection.getDialect()).toBe('mysql');
      expect(connection.options.host).toBe('db');
      await connection.close();
    });
  });
});
