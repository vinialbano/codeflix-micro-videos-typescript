import { deepFreeze } from '#seedwork/domain';

describe('Object Unit Tests', () => {
  describe('deepFreeze() function', () => {
    it('should not freeze a primitive value', () => {
      expect(deepFreeze(null)).toBe(null);
      expect(deepFreeze(undefined)).toBe(undefined);
      expect(deepFreeze(0)).toBe(0);
      expect(deepFreeze(1)).toBe(1);
      expect(deepFreeze('')).toBe('');
      expect(deepFreeze('value')).toBe('value');
    });

    it('should freeze an object', () => {
      const obj = { prop: 'value' };
      const frozen = deepFreeze(obj);
      expect(frozen).toStrictEqual(obj);
      expect(Object.isFrozen(frozen)).toBe(true);
    });

    it('should freeze nested objects', () => {
      const obj = { prop: { nestedProp: 'value' } };
      const frozen = deepFreeze(obj);
      expect(frozen).toStrictEqual(obj);
      expect(Object.isFrozen(frozen)).toBe(true);
      expect(Object.isFrozen(frozen.prop)).toBe(true);
    });

    it('should freeze nested arrays', () => {
      const obj = { prop: ['value'] };
      const frozen = deepFreeze(obj);
      expect(frozen).toStrictEqual(obj);
      expect(Object.isFrozen(frozen)).toBe(true);
      expect(Object.isFrozen(frozen.prop)).toBe(true);
    });

    it('should freeze nested arrays of objects', () => {
      const obj = { prop: [{ nestedProp: 'value' }] };
      const frozen = deepFreeze(obj);
      expect(frozen).toStrictEqual(obj);
      expect(Object.isFrozen(frozen)).toBe(true);
      expect(Object.isFrozen(frozen.prop)).toBe(true);
      expect(Object.isFrozen(frozen.prop[0])).toBe(true);
    });

    it('should be immutable', () => {
      const obj = { prop: 'value' };
      const frozen = deepFreeze(obj);
      expect(() => {
        (frozen as any).prop = 'other value';
      }).toThrow(
        "Cannot assign to read only property 'prop' of object '#<Object>'",
      );
    });
  });
});
