import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataWrapperInterceptor } from './shared-module/interceptors/data-wrapper/data-wrapper.interceptor';
import { NotFoundErrorFilter } from './shared-module/filters/not-found-error/not-found-error.filter';
import { EntityValidationErrorFilter } from './shared-module/filters/entity-validation-error/entity-validation-error.filter';

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new DataWrapperInterceptor(),
  );

  app.useGlobalFilters(
    new NotFoundErrorFilter(),
    new EntityValidationErrorFilter(),
  );
}
