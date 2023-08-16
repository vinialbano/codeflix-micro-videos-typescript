import { z } from 'zod';
import { Entity } from '../entities';
import { ZodValidator } from '../validators';
import { SearchParamsProps } from './search-params';

const schema = z
  .object({
    page: z
      .number()
      .or(z.string())
      .pipe(z.coerce.number().int().min(1))
      .catch(1),
    limit: z
      .number()
      .or(z.string())
      .pipe(z.coerce.number().int().min(1))
      .catch(15),
    sort: z.string().trim().min(1).nullable().catch(null),
    order: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/asc|desc/)
      .catch('asc'),
    filter: z.string().min(1).nullable().catch(null),
  })
  .refine((value) => {
    if (!value.sort) {
      value.order = null;
    }
    return true;
  });

export class SearchParamsValidator<
  E extends Entity,
  Filter,
> extends ZodValidator<SearchParamsProps<E, Filter>> {
  constructor() {
    super(schema);
  }

  validate(input: SearchParamsProps<E, Filter>): boolean {
    return super.validate(input);
  }
}
