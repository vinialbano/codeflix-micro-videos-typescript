import { z } from 'zod';
import { Entity } from '../entities';
import { ZodValidator } from '../validators';
import { SearchResultProps } from './search-result';

function makeSchema<T>(c: new (...args: any[]) => T) {
  return z
    .object({
      items: z.array(z.instanceof(c)),
      total: z.number().int().min(0),
      currentPage: z.number().int().min(1),
      limit: z.number().int().min(1),
      sort: z.string().trim().min(1).nullable(),
      order: z
        .string()
        .trim()
        .toLowerCase()
        .regex(/asc|desc/, "Must be 'asc' or 'desc'")
        .nullable(),
      filter: z.string().trim().min(1).nullable(),
    })
    .refine((value) => value.sort === null || value.order !== null, {
      message: 'Required if sort is provided',
      path: ['order'],
    })
    .refine((value) => value.sort !== null || value.order === null, {
      message: 'Must be null if sort is not provided',
      path: ['order'],
    });
}

export class SearchResultValidator<
  E extends Entity,
  Filter = string,
> extends ZodValidator<SearchResultProps<E, Filter>> {
  constructor(itemsClass: new (...args: any[]) => E) {
    const schema = makeSchema(itemsClass);
    super(schema);
  }

  validate(input: SearchResultProps<E, Filter>): boolean {
    return super.validate(input);
  }
}
