export type ValidationErrors =
  | { _errors: string[] }
  | ({ _errors: string[] } & {
      [field: string]: ValidationErrors;
    });

export interface Validator<T> {
  validate(data: T): boolean;
  get errors(): ValidationErrors | null;
  get validatedData(): T | null;
}
