import { UniqueEntityID, ZodValidator } from '#seedwork/domain';
import { z } from 'zod';
import { CategoryProperties } from '../entitites';

const schema = z.object({
  id: z.instanceof(UniqueEntityID).optional(),
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().optional().nullable().default(null),
  isActive: z.boolean().optional().default(true),
  createdAt: z
    .date()
    .optional()
    .default(() => new Date()),
});

export class CategoryValidator extends ZodValidator<
  Required<CategoryProperties> & { id?: UniqueEntityID }
> {
  constructor() {
    super(schema);
  }

  validate(input: CategoryProperties, id?: UniqueEntityID): boolean {
    return super.validate({ id, ...input });
  }
}
