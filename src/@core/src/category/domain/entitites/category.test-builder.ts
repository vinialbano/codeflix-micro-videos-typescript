import { UniqueEntityID } from '#seedwork/domain';
import { Chance } from 'chance';
import { Category } from './category';

type TypeOrFactory<T> = T | ((i: number) => T);

export class CategoryTestBuilder<T extends Category | Category[] = any> {
  private chance: Chance.Chance;
  private count: number;
  private factories!: {
    id?: (index: number) => UniqueEntityID;
    name: (index: number) => string;
    description: (index: number) => string | null;
    isActive?: (index: number) => boolean;
    createdAt?: (index: number) => Date;
  };

  private constructor(count: number) {
    this.count = count;
    this.chance = new Chance();
    this.reset();
  }

  public static aCategory(): CategoryTestBuilder<Category> {
    return new CategoryTestBuilder(1);
  }

  public static manyCategories(count: number): CategoryTestBuilder<Category[]> {
    return new CategoryTestBuilder(count);
  }

  reset(): void {
    this.factories = {
      id: undefined,
      name: () => this.chance.name(),
      description: () => this.chance.sentence(),
      isActive: undefined,
      createdAt: undefined,
    };
  }

  public withId(id: TypeOrFactory<UniqueEntityID>): this {
    this.factories.id = typeof id === 'function' ? id : () => id;
    return this;
  }

  public withInvalidIdIsNotUniqueEntityID<TProp>(
    id?: Exclude<TProp, TypeOrFactory<UniqueEntityID>>,
  ): this {
    if (id === undefined) {
      this.factories.id = () => this.chance.string() as any;
    } else {
      this.factories.id = typeof id === 'function' ? (id as any) : () => id;
    }
    return this;
  }

  public withName(name: TypeOrFactory<string>): this {
    this.factories.name = typeof name === 'function' ? name : () => name;
    return this;
  }

  public withInvalidNameIsNotString<TProp>(
    name?: Exclude<TProp, TypeOrFactory<string | null>>,
  ): this {
    if (name === undefined) {
      this.factories.name = () => this.chance.integer() as any;
    } else {
      this.factories.name =
        typeof name === 'function' ? (name as any) : () => name;
    }
    return this;
  }

  public withInvalidNameIsTooShort(name?: TypeOrFactory<string>): this {
    if (name === undefined) {
      this.factories.name = () => '';
    } else {
      this.factories.name = typeof name === 'function' ? name : () => name;
    }
    return this;
  }

  public withInvalidNameIsTooLong(name?: TypeOrFactory<string>): this {
    if (name === undefined) {
      this.factories.name = () => this.chance.string({ length: 256 });
    } else {
      this.factories.name = typeof name === 'function' ? name : () => name;
    }
    return this;
  }

  public withDescription(description: TypeOrFactory<string | null>): this {
    this.factories.description =
      typeof description === 'function' ? description : () => description;
    return this;
  }

  public withInvalidDescriptionIsNotStringOrNull<TProp>(
    description?: Exclude<TProp, TypeOrFactory<string | null>>,
  ): this {
    if (description === undefined) {
      this.factories.description = () => this.chance.integer() as any;
    } else {
      this.factories.description =
        typeof description === 'function'
          ? (description as any)
          : () => description;
    }
    return this;
  }

  public active(): this {
    this.factories.isActive = () => true;
    return this;
  }

  public inactive(): this {
    this.factories.isActive = () => false;
    return this;
  }

  public withIsActive(isActive: TypeOrFactory<boolean>): this {
    this.factories.isActive =
      typeof isActive === 'function' ? isActive : () => isActive;
    return this;
  }

  public withInvalidIsActiveIsNotBoolean<TProp>(
    isActive?: Exclude<TProp, TypeOrFactory<boolean>>,
  ): this {
    if (isActive === undefined) {
      this.factories.isActive = () => this.chance.integer() as any;
    } else {
      this.factories.isActive =
        typeof isActive === 'function' ? (isActive as any) : () => isActive;
    }
    return this;
  }

  public withCreatedAt(createdAt: TypeOrFactory<Date>): this {
    this.factories.createdAt =
      typeof createdAt === 'function' ? createdAt : () => createdAt;
    return this;
  }

  public withInvalidCreatedAtIsNotDate<TProp>(
    createdAt?: Exclude<TProp, TypeOrFactory<Date>>,
  ): this {
    if (createdAt === undefined) {
      this.factories.createdAt = () => this.chance.integer() as any;
    } else {
      this.factories.createdAt =
        typeof createdAt === 'function' ? (createdAt as any) : () => createdAt;
    }
    return this;
  }

  public build(): T {
    const entities = Array.from(
      { length: this.count },
      (v, i) =>
        new Category(
          {
            name: this.factories.name(i),
            description: this.factories.description(i),
            ...(this.factories.isActive && {
              isActive: this.factories.isActive(i),
            }),
            ...(this.factories.createdAt && {
              createdAt: this.factories.createdAt(i),
            }),
          },
          this.factories.id?.(i),
        ),
    );
    if (this.count === 1) {
      return entities[0] as T;
    }
    return entities as T;
  }

  get id(): UniqueEntityID {
    if (!this.factories.id) {
      throw new Error(
        'The id factory is not set. You must set it using "with" methods before calling this method.',
      );
    }
    return this.factories.id(0);
  }

  get name(): string {
    return this.factories.name(0);
  }

  get description(): string | null {
    return this.factories.description(0);
  }

  get isActive(): boolean {
    if (!this.factories.isActive) {
      throw new Error(
        'The isActive factory is not set. You must set it using "with" methods before calling this method.',
      );
    }
    return this.factories.isActive(0);
  }

  get createdAt(): Date {
    if (!this.factories.createdAt) {
      throw new Error(
        'The createdAt factory is not set. You must set it using "with" methods before calling this method.',
      );
    }
    return this.factories.createdAt(0);
  }
}
