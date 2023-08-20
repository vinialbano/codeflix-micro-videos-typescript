import { EntityValidationError, ValidationErrors } from '#seedwork/domain';

describe('Jest Custom Validations', () => {
  describe('toContainErrorMessages()', () => {
    it('should pass when the error messages are contained', () => {
      const errors = {
        name: {
          _errors: ['Name is required'],
        },
        age: {
          _errors: ['Age is required'],
        },
      };

      expect(errors).toContainErrorMessages({
        name: {
          _errors: ['Name is required'],
        },
      });
    });

    it('should fail when the error messages are not contained', () => {
      const errors = {
        name: {
          _errors: ['Name is required'],
        },
      };

      expect(errors).not.toContainErrorMessages({
        age: {
          _errors: ['Age is required'],
        },
      });
    });

    it('should pass when the error messages are contained in a function', () => {
      const errors: ValidationErrors = {
        _errors: [],
        name: {
          _errors: ['Name is required'],
        },
        age: {
          _errors: ['Age is required'],
        },
      };

      expect(() => {
        throw new EntityValidationError(errors);
      }).toContainErrorMessages({
        name: {
          _errors: ['Name is required'],
        },
      });
    });

    it('should fail when the error messages are not contained in a function', () => {
      const errors: ValidationErrors = {
        _errors: [],
        name: {
          _errors: ['Name is required'],
        },
      };

      expect(() => {
        throw new EntityValidationError(errors);
      }).not.toContainErrorMessages({
        age: {
          _errors: ['Age is required'],
        },
      });
    });
  });
});
