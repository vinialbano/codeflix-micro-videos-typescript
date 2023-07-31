export class InvalidUUIDError extends Error {
  constructor(id: string, message?: string) {
    super(message || `${id} must be a valid UUID.`);
    this.name = "InvalidUUIDError";
  }
}
