import { ValueObject } from '../value-object';

class StringValueObject extends ValueObject {
  constructor(public readonly value: string) {
    super();
    this.validate();
  }

  protected validate(): never | void {
    if (!this.value) {
      throw new Error('String value must be provided');
    }
  }
}

class ComplexValueObject extends ValueObject {
  constructor(
    public readonly stringValue: string,
    public readonly numberValue: number,
  ) {
    super();
    this.validate();
  }

  protected validate(): never | void {
    if (!this.stringValue) {
      throw new Error('String value must be provided');
    }
    if (!this.numberValue) {
      throw new Error('Number value must be provided');
    }
  }
}

describe('ValueObject Unit Tests', () => {
  describe('equals()', () => {
    it('should return false if the given value object is null or undefined', () => {
      const vo = new StringValueObject('test');
      expect(vo.equals(null as any)).toBe(false);
      expect(vo.equals(undefined as any)).toBe(false);
    });

    it('should return false if the two value objects are not instances of the same class', () => {
      const vo1 = new StringValueObject('test');
      const vo2 = new ComplexValueObject('test', 1);
      expect(vo1.equals(vo2)).toBe(false);
    });

    it('should return false if two value objects are not equal', () => {
      const vo1 = new StringValueObject('test1');
      const vo2 = new StringValueObject('test2');
      expect(vo1.equals(vo2)).toBe(false);

      const vo3 = new ComplexValueObject('test', 1);
      const vo4 = new ComplexValueObject('test', 2);
      expect(vo3.equals(vo4)).toBe(false);
    });

    it('should return true if two value objects are equal', () => {
      const vo1 = new StringValueObject('test');
      const vo2 = new StringValueObject('test');
      expect(vo1.equals(vo2)).toBe(true);

      const vo3 = new ComplexValueObject('test', 1);
      const vo4 = new ComplexValueObject('test', 1);
      expect(vo3.equals(vo4)).toBe(true);
    });
  });

  describe('toString()', () => {
    it('should return a string representation of the value object', () => {
      const vo = new StringValueObject('test');
      expect(vo.toString()).toBe(JSON.stringify({ value: 'test' }));

      const vo2 = new ComplexValueObject('test', 1);
      expect(vo2.toString()).toBe(
        JSON.stringify({ stringValue: 'test', numberValue: 1 }),
      );
    });
  });

  describe('validate()', () => {
    it('should throw an error if the value object is not valid', () => {
      expect(() => new StringValueObject('')).toThrow(
        new Error('String value must be provided'),
      );

      expect(() => new ComplexValueObject('', 1)).toThrow(
        new Error('String value must be provided'),
      );

      expect(() => new ComplexValueObject('test', null as any)).toThrow(
        new Error('Number value must be provided'),
      );
    });

    it('should not throw an error if the value object is valid', () => {
      expect(() => new StringValueObject('test')).not.toThrow();
      expect(() => new ComplexValueObject('test', 1)).not.toThrow();
    });
  });
});
