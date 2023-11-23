export type ErrorFields = {
  [field: string]: string[];
};

export interface ValidatorFields<ValidatedProps> {
  errors: ErrorFields | null;
  validatedData: ValidatedProps | null;
  validate(data: any): boolean;
}
