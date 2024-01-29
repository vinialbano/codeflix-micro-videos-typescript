import { Entity } from '@core/shared/domain/entity';
import { EntityValidationErrorFilter } from './entity-validation-error.filter';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { EntityValidationError } from '@core/shared/domain/errors/validation.error';

class StubEntity extends Entity {
  entityId: any;
  toJSON() {
    return {};
  }
}

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new EntityValidationError([
      'main error',
      {
        field1: ['field1 is required', 'field1 must be a string'],
      },
      {
        field2: ['field2 is required'],
      },
    ]);
  }
}

describe('EntityValidationErrorFilter Unit Tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new EntityValidationErrorFilter());
    await app.init();
  });

  it('should catch a EntityValidationError', () => {
    return request(app.getHttpServer())
      .get('/stub')
      .expect(422)
      .expect({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: [
          'main error',
          'field1 is required',
          'field1 must be a string',
          'field2 is required',
        ],
      });
  });
});
