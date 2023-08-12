import * as z from 'zod';
import { ZodValidator } from '../zod-validator';
jest.mock('zod', () => ({
  object: jest.fn().mockImplementation(() => {}),
}));

class StubValidator extends ZodValidator<{}> {
  constructor() {
    super(z.object({}));
  }
}

const makeSut = ({ shouldFail = false }) => {
  const mockFormat = jest.fn().mockReturnValue('error');
  const mockSafeParse = jest.fn().mockImplementation(() => {
    return {
      success: !shouldFail,
      error: { format: mockFormat },
      data: {},
    };
  });
  const mockObject = jest.spyOn(z, 'object').mockImplementation(() => {
    return {
      safeParse: mockSafeParse,
    } as any;
  });
  const sut = new StubValidator();
  return { sut, mockObject, mockSafeParse, mockFormat };
};

describe('ZodValidator Unit Tests', () => {
  beforeEach(() => {});
  describe('constructor()', () => {
    it('should initialize validator with errors and validatedData as null', () => {
      const validator = new StubValidator();
      expect(validator.errors).toBeNull();
      expect(validator.validatedData).toBeNull();
    });
  });

  describe('validate()', () => {
    it('should set errors and return false when input is invalid', () => {
      const { sut, mockSafeParse, mockFormat } = makeSut({ shouldFail: true });
      const isValid = sut.validate({});
      const errors = mockFormat.mock.results[0].value;
      expect(isValid).toBe(false);
      expect(mockSafeParse).toHaveBeenCalled();
      expect(mockFormat).toHaveBeenCalled();
      expect(sut.errors).toStrictEqual(errors);
      expect(sut.validatedData).toBeNull();
    });

    it('should set validatedData and return true when input is valid', () => {
      const { sut, mockSafeParse } = makeSut({});
      const isValid = sut.validate({});
      const data = mockSafeParse.mock.results[0].value.data;
      expect(isValid).toBe(true);
      expect(mockSafeParse).toHaveBeenCalled();
      expect(sut.errors).toBeNull();
      expect(sut.validatedData).toStrictEqual(data);
    });
  });
});
