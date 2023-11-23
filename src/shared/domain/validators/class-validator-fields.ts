import { validateSync } from "class-validator";
import { ErrorFields, ValidatorFields } from "./validator-fields";

export abstract class ClassValidatorFields<ValidatedProps>
  implements ValidatorFields<ValidatedProps>
{
  errors: ErrorFields | null = null;
  validatedData: ValidatedProps | null = null;

  validate(data: any): boolean {
    const errors = validateSync(data);
    if (errors.length) {
      this.errors = {};
      for (const error of errors) {
        const field = error.property;
        this.errors[field] = Object.values(error.constraints!);
      }
    } else {
      this.validatedData = data;
    }
    return !errors.length;
  }
}
