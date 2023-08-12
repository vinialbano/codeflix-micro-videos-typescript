import { ZodValidator } from "#seedwork/domain";
import { z } from "zod";
import { CategoryProperties } from "../entitites";

const schema = z.object({
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.date().optional(),
});

export class CategoryValidator extends ZodValidator<CategoryProperties> {
  constructor() {
    super(schema);
  }

  validate(input: CategoryProperties): boolean {
    return super.validate(input);
  }
}
