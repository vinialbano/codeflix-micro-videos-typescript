import { Either } from './either';

describe('Either Unit Tests', () => {
  describe('static constructors', () => {
    describe('ok()', () => {
      it('should set the value for ok and return an instance of Either', () => {
        const either = Either.ok('ok');
        expect(either).toBeInstanceOf(Either);
        expect(either.ok).toBe('ok');
        expect(either.error).toBe(null);
      });
    });

    describe('fail()', () => {
      it('should set the value for error and return an instance of Either', () => {
        const error = new Error('error');
        const either = Either.fail(error);
        expect(either).toBeInstanceOf(Either);
        expect(either.ok).toBe(null);
        expect(either.error).toBe(error);
      });
    });

    describe('safe()', () => {
      it('should return an instance of Either with the value of the function', () => {
        const either = Either.safe(() => 'ok');
        expect(either).toBeInstanceOf(Either);
        expect(either.ok).toBe('ok');
        expect(either.error).toBe(null);
      });

      it('should return an instance of Either with the error of the function', () => {
        const error = new Error('error');
        const either = Either.safe(() => {
          throw error;
        });
        expect(either).toBeInstanceOf(Either);
        expect(either.ok).toBe(null);
        expect(either.error).toBe(error);
      });
    });
  });

  describe('getters', () => {
    describe('ok', () => {
      it('should return the value of the instance', () => {
        const either = Either.ok('ok');
        expect(either.ok).toBe('ok');
      });
    });

    describe('error', () => {
      it('should return the error of the instance', () => {
        const error = new Error('error');
        const either = Either.fail(error);
        expect(either.error).toBe(error);
      });
    });

    describe('isOk()', () => {
      it('should return true if the instance is ok', () => {
        const either = Either.ok('ok');
        expect(either.isOk()).toBe(true);
      });

      it('should return false if the instance is not ok', () => {
        const error = new Error('error');
        const either = Either.fail(error);
        expect(either.isOk()).toBe(false);
      });
    });

    describe('isFail()', () => {
      it('should return true if the instance is fail', () => {
        const error = new Error('error');
        const either = Either.fail(error);
        expect(either.isFail()).toBe(true);
      });

      it('should return false if the instance is not fail', () => {
        const either = Either.ok('ok');
        expect(either.isFail()).toBe(false);
      });
    });

    describe('asArray()', () => {
      it('should return an array with the value of the instance and null as error', () => {
        const either = Either.ok('ok');
        expect(either.asArray()).toEqual(['ok', null]);
      });

      it('should return an array with the error of the instance and null as the value', () => {
        const error = new Error('error');
        const either = Either.fail(error);
        expect(either.asArray()).toEqual([null, error]);
      });
    });
  });

  describe('utilities', () => {
    describe('map()', () => {
      it('should return an instance of Either with the value transformed', () => {
        const either = Either.ok('ok').map((value) => value.toUpperCase());
        expect(either).toBeInstanceOf(Either);
        expect(either.ok).toBe('OK');
        expect(either.error).toBe(null);
      });

      it('should return an instance of Either with the error', () => {
        const error = new Error('error');
        const either = Either.fail(error).map((value) => value);
        expect(either).toBeInstanceOf(Either);
        expect(either.ok).toBe(null);
        expect(either.error).toBe(error);
      });
    });

    describe('chain()', () => {
      it('should return a new value based on the value of the current instance', () => {
        const either = Either.ok('ok').chain((value) =>
          Either.ok(value.toUpperCase()),
        );
        expect(either).toBeInstanceOf(Either);
        expect(either.ok).toBe('OK');
        expect(either.error).toBe(null);
      });

      it('should return an error based on the value of the current instance', () => {
        const error = new Error('error');
        const either = Either.fail(error).chain((value) => Either.ok(value));
        expect(either).toBeInstanceOf(Either);
        expect(either.ok).toBe(null);
        expect(either.error).toBe(error);
      });

      it('should return an error based on the value of the new instance', () => {
        const error = new Error('error');
        const either = Either.ok('ok').chain(() => Either.fail(error));
        expect(either).toBeInstanceOf(Either);
        expect(either.ok).toBe(null);
        expect(either.error).toBe(error);
      });
    });

    describe('chainEach()', () => {
      it('should throw an error if the value is not an array', () => {
        expect(() => {
          Either.ok('ok').chainEach(() => Either.ok('ok'));
        }).toThrow(new Error('Method chainEach can only be used with arrays'));
      });

      it('should return new values based on the values of the current instance', () => {
        const either = Either.ok(['ok']).chainEach((value) =>
          Either.ok(value.toUpperCase()),
        );
        expect(either).toBeInstanceOf(Either);
        expect(either.ok).toEqual(['OK']);
        expect(either.error).toBe(null);
      });

      it('should return an error based on the values of the current instance', () => {
        const error = new Error('error');
        const either = Either.fail(error).chainEach((value) =>
          Either.ok(value),
        );
        expect(either).toBeInstanceOf(Either);
        expect(either.ok).toBe(null);
        expect(either.error).toBe(error);
      });

      it('should return errors based on the values of the new instance', () => {
        const error = new Error('error');
        const either = Either.ok(['ok']).chainEach(() => Either.fail(error));
        expect(either).toBeInstanceOf(Either);
        expect(either.ok).toBe(null);
        expect(either.error).toEqual([error]);
      });
    });

    describe('[Symbol.iterator]()', () => {
      it('should return an iterator', () => {
        const either = Either.ok('ok');
        const iterator = either[Symbol.iterator]();
        expect(iterator.next).toBeInstanceOf(Function);
      });

      it('should return an iterator with the value of the instance', () => {
        const either = Either.ok('ok');
        const iterator = either[Symbol.iterator]();

        let next = iterator.next();
        expect(next.value).toBe('ok');
        expect(next.done).toBe(false);

        next = iterator.next();
        expect(next.value).toBe(null);
        expect(next.done).toBe(false);

        next = iterator.next();
        expect(next.value).toBe(null);
        expect(iterator.next().done).toBe(true);
      });

      it('should return an iterator with the error of the instance', () => {
        const error = new Error('error');
        const either = Either.fail(error);
        const iterator = either[Symbol.iterator]();

        let next = iterator.next();
        expect(next.value).toBe(null);
        expect(next.done).toBe(false);

        next = iterator.next();
        expect(next.value).toBe(error);
        expect(next.done).toBe(false);

        next = iterator.next();
        expect(next.value).toBe(null);
        expect(iterator.next().done).toBe(true);
      });
    });
  });
});
