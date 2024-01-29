import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { applyGlobalConfig } from '../src/nest-modules/global-config';
import { Sequelize } from 'sequelize-typescript';
import { getConnectionToken } from '@nestjs/sequelize';

export function startApp() {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const sequelize = moduleFixture.get<Sequelize>(getConnectionToken());
    await sequelize.sync({ force: true });
    app = moduleFixture.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
  });

  afterEach(async () => {
    await app?.close();
  });

  return {
    get app() {
      return app;
    },
  };
}
