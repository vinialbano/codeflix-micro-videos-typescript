import { getConnectionToken } from '@nestjs/sequelize';
import { Test } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { ConfigModule } from '../config/config.module';
import { DatabaseModule } from './database.module';

describe('DatabaseModule Unit Tests', () => {
  it('should return a sqlite connection', async () => {
    const module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          ignoreEnvVars: true,
          validate: null,
          load: [
            () => ({
              DB_VENDOR: 'sqlite',
              DB_HOST: ':memory:',
              DB_LOGGING: false,
              DB_AUTO_LOAD_MODELS: true,
            }),
          ],
        }),
      ],
    }).compile();

    const app = module.createNestApplication();
    const conn = app.get<Sequelize>(getConnectionToken());
    expect(conn.options.dialect).toBe('sqlite');
    expect(conn.options.host).toBe(':memory:');
    await conn.close();
  });

  // TODO
  it.skip('should return a mysql connection', async () => {
    const module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          ignoreEnvVars: true,
          validate: null,
          load: [
            () => ({
              DB_VENDOR: 'mysql',
              DB_HOST: 'localhost',
              DB_DATABASE: 'micro-videos',
              DB_USERNAME: 'root',
              DB_PASSWORD: 'root',
              DB_PORT: 3306,
              DB_LOGGING: false,
              DB_AUTO_LOAD_MODELS: true,
            }),
          ],
        }),
      ],
    }).compile();

    const app = module.createNestApplication();
    const conn = app.get<Sequelize>(getConnectionToken());
    expect(conn.options.dialect).toBe('mysql');
    expect(conn.options.host).toBe('localhost');
    expect(conn.options.database).toBe('micro-videos');
    expect(conn.options.username).toBe('root');
    expect(conn.options.password).toBe('root');
    expect(conn.options.port).toBe(3306);
    await conn.close();
  });
});
