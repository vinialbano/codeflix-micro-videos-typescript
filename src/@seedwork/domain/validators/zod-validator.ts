import { z } from "zod";
import { ValidationErrors, Validator } from "./validator.interface";

export abstract class ZodValidator<T extends object> implements Validator<T> {
  private _errors: ValidationErrors | null = null;
  private _validatedData: T | null = null;

  constructor(private schema: z.ZodTypeAny) {}

  get errors(): ValidationErrors | null {
    return this._errors;
  }

  get validatedData(): T | null {
    return this._validatedData;
  }

  validate(input: any): boolean {
    const result = this.schema.safeParse(input);
    if (result.success === false) {
      this._errors = result.error.format();
      this._validatedData = null;
      return false;
    }
    this._validatedData = result.data;
    this._errors = null;
    return true;
  }
}
