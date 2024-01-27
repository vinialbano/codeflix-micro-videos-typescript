import { ValueObject } from './value-object';
import { randomUUID } from 'crypto';

export function isValidUUIDv4(uuid: string): boolean {
  const uuidV4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4Regex.test(uuid);
}

export class UUID extends ValueObject {
  public readonly id: string;

  constructor(id?: string) {
    super();
    this.id = id || randomUUID();
    this.validate();
  }

  protected validate(): void {
    if (!isValidUUIDv4(this.id)) {
      throw new InvalidUUIDError(this.id);
    }
  }

  public toString(): string {
    return this.id;
  }
}

export class InvalidUUIDError extends Error {
  constructor(id: string) {
    super(`Invalid UUID: ${id}`);
    this.name = 'InvalidUUIDError';
  }
}
