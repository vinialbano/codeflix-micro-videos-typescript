type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

type Value<Ok, Error> = Ok | Error;

type Success<Ok> = Either<Ok, null>;
type Fail<Error> = Either<null, Error>;

export class Either<Ok, ErrorType = Error>
  implements Iterable<Value<Ok, ErrorType>>
{
  private _ok: Ok;
  private _error: ErrorType;

  private constructor(ok: Ok, error: ErrorType) {
    this._ok = ok;
    this._error = error;
  }

  get ok() {
    return this._ok;
  }

  get error() {
    return this._error;
  }

  isOk(): this is Ok {
    return this._ok !== null;
  }

  isFail(): this is ErrorType {
    return this._error !== null;
  }

  static ok<T>(value: T): Success<T> {
    return new Either(value, null);
  }

  static fail<T>(error: T): Fail<T> {
    return new Either(null, error);
  }

  static safe<Ok, ErrorType = Error>(
    fn: () => Ok,
  ): Success<Ok> | Fail<ErrorType> {
    try {
      return Either.ok(fn());
    } catch (error) {
      return Either.fail(error as ErrorType);
    }
  }

  /*
   * This method is used to transform the value into a new value.
   * The new value will always be an Ok value.
   */
  map<NewOk>(fn: (value: Ok) => NewOk): Success<NewOk> | Fail<ErrorType> {
    if (this.isOk()) {
      return Either.ok(fn(this.ok));
    }
    return Either.fail(this.error);
  }

  /*
   * This method is used to create a new Either instance based on the value of the current instance.
   * The new Either can be an Ok or a Fail.
   */
  chain<NewOk, NewError = Error>(
    fn: (value: Ok) => Success<NewOk> | Fail<NewError>,
  ): Success<NewOk> | Fail<NewError> | Fail<ErrorType> {
    if (this.isOk()) {
      return fn(this.ok);
    }
    return Either.fail(this.error);
  }

  /*
   * This method is used to create a new Either instance based on the value of the current instance.
   * This method is used with arrays.
   * If one of the values is a Fail, the new Either will be a Fail.
   * The new Either can be an Ok or a Fail.
   */
  chainEach<NewOk, NewError>(
    fn: (
      value: Flatten<Ok>,
    ) => Success<Flatten<NewOk>> | Fail<Flatten<NewError>>,
  ): Success<NewOk[]> | Fail<NewError[]> | Fail<ErrorType> {
    if (this.isOk()) {
      if (!Array.isArray(this.ok)) {
        throw new Error('Method chainEach can only be used with arrays');
      }

      const result = this.ok.map((value) => fn(value));
      const errors = result.filter((value) => value.isFail());
      if (errors.length > 0) {
        return Either.fail(errors.map((error) => error.error) as NewError[]);
      }
      return Either.ok(result.map((value) => value.ok) as NewOk[]);
    }
    return Either.fail(this.error);
  }

  asArray(): [Ok, ErrorType] {
    return [this.ok, this.error];
  }

  [Symbol.iterator](): Iterator<Value<Ok, ErrorType>, any, undefined> {
    return new EitherIterator<Ok, ErrorType>({
      ok: this.ok,
      error: this.error,
    });
  }
}

class EitherIterator<Ok, Error>
  implements Iterator<Value<Ok, Error>, Value<Ok, Error>, undefined>
{
  private _value: { ok: Ok; error: Error };
  private index = 0;

  constructor(value: { ok: Ok; error: Error }) {
    this._value = value;
  }

  next(): IteratorResult<Value<Ok, Error>> {
    if (this.index === 0) {
      this.index++;
      return {
        value: this._value.ok,
        done: false,
      };
    }
    if (this.index === 1) {
      this.index++;
      return {
        value: this._value.error,
        done: false,
      };
    }
    return {
      value: null,
      done: true,
    };
  }
}
