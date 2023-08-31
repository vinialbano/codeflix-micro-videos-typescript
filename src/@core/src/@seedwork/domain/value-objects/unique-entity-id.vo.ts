import { randomUUID } from 'crypto';
import { InvalidUUIDError } from '../errors';
import { ValueObject } from './value-object';

export class UniqueEntityID extends ValueObject<string> {
  constructor(id?: string) {
    super(id?.toLowerCase() ?? randomUUID());
    this.validate();
  }

  private validate(): void {
    const UUIDv4Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const isValid = UUIDv4Regex.test(this.value);
    if (!isValid) {
      throw new InvalidUUIDError(this.value);
    }
  }

  equals(id: UniqueEntityID) {
    return this.value === id.value;
  }

  get id(): string {
    return this.value;
  }
}
