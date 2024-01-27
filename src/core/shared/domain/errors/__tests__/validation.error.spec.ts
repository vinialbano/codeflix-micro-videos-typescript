import { ValidationError } from '../validation.error';

describe('ValidationError Unit Tests', () => {
  describe('constructor()', () => {
    it('should create a ValidationError instance with the given errors', () => {
      const errors = [
        {
          name: ['Name is required'],
          email: ['Email is required', 'Email is invalid'],
        },
      ];

      const validationError = new ValidationError(errors);
      expect(validationError.message).toBe('Validation error');
      expect(validationError.name).toBe('ValidationError');
      expect(validationError.errors).toBe(errors);
    });
  });

  describe('count()', () => {
    it('should return the number of errors', () => {
      const errors = [
        {
          name: ['Name is required'],
          email: ['Email is required', 'Email is invalid'],
        },
      ];

      const validationError = new ValidationError(errors);
      expect(validationError.count()).toBe(1);
    });
  });
});
