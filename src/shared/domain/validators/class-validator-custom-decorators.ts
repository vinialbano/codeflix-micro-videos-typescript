import { ValidateIf, ValidationOptions } from "class-validator";

/**
 * Skips validation if the target is null
 *
 * @example
 * ```typescript
 * class TestModel {
 *     @IsNullable({ always: true })
 *     big: string | null;
 * }
 * ```
 */
export function IsNullable(options?: ValidationOptions): PropertyDecorator {
  return function IsNullableDecorator(
    prototype: object,
    propertyKey: string | symbol
  ): void {
    ValidateIf((obj): boolean => null !== obj[propertyKey], options)(
      prototype,
      propertyKey
    );
  };
}
