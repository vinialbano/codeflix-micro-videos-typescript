import { lastValueFrom, of } from 'rxjs';
import { DataWrapperInterceptor } from './data-wrapper.interceptor';

describe('DataWrapperInterceptor', () => {
  let interceptor: DataWrapperInterceptor;

  beforeEach(() => {
    interceptor = new DataWrapperInterceptor();
  });

  it('should wrap the response in a "data" object', async () => {
    expect(interceptor).toBeDefined();
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of({ name: 'test' }),
    });

    const result = await lastValueFrom(obs$);
    expect(result).toEqual({ data: { name: 'test' } });
  });

  it('should not wrap the response in a "data" object when "meta" is present', async () => {
    expect(interceptor).toBeDefined();
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of({ name: 'test', meta: {} }),
    });

    const result = await lastValueFrom(obs$);
    expect(result).toEqual({ name: 'test', meta: {} });
  });

  it('should not wrap the response in a "data" object when the body is nullable', async () => {
    expect(interceptor).toBeDefined();
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of(null),
    });

    const result = await lastValueFrom(obs$);
    expect(result).toEqual(null);
  });
});
