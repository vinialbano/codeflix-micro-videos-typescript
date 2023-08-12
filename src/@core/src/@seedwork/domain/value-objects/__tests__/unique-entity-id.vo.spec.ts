import { InvalidUUIDError, UniqueEntityID } from '#seedwork/domain';

describe('UniqueEntityID Unit Tests', () => {
  describe('Constructor of UniqueEntityID', () => {
    it('should create a unique entity id with a valid uuid', () => {
      const id = new UniqueEntityID();
      expect(id).toBeDefined();
      expect(id.id).toMatch(
        /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/,
      );
    });

    it('should create a unique entity id with the given uuid', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const id = new UniqueEntityID(uuid);
      expect(id).toBeDefined();
      expect(id.id).toBe(uuid);
    });

    it('should call the validate method', () => {
      const spy = jest.spyOn(UniqueEntityID.prototype as any, 'validate');
      const id = new UniqueEntityID();
      expect(spy).toHaveBeenCalled();
    });

    it('should throw an error when the given uuid is invalid', () => {
      expect(() => new UniqueEntityID('invalid-id')).toThrow(InvalidUUIDError);
    });
  });

  describe('equals method', () => {
    it('should return true when the given id is equal', () => {
      const id = new UniqueEntityID();
      const id2 = new UniqueEntityID(id.id);
      expect(id.equals(id2)).toBe(true);
    });

    it('should return false when the given id is not equal', () => {
      const id = new UniqueEntityID();
      const id2 = new UniqueEntityID();
      expect(id.equals(id2)).toBe(false);
    });
  });
});
