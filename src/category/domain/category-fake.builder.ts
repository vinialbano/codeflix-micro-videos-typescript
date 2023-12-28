import { Chance } from "chance";
import { UUID } from "../../shared/domain/value-objects/uuid.vo";
import { Category } from "./category.entity";

type PropOrFactory<T> = T | ((i: number) => T);

export class CategoryFakeBuilder<TBuild = any> {
  private _categoryId: PropOrFactory<UUID> | undefined = undefined;

  private _name: PropOrFactory<string> = (_index) => this.chance.word();

  private _description: PropOrFactory<string | null> = (_index) =>
    this.chance.sentence();

  private _isActive: PropOrFactory<boolean> = (_index) => true;

  private _createdAt: PropOrFactory<Date> | undefined = undefined;

  private countObjs;

  static aCategory() {
    return new CategoryFakeBuilder<Category>();
  }

  static someCategories(count: number) {
    return new CategoryFakeBuilder<Category[]>(count);
  }

  private chance: Chance.Chance;

  private constructor(count: number = 1) {
    this.countObjs = count;
    this.chance = Chance();
  }

  withUUID(valueOrFactory: PropOrFactory<UUID>) {
    this._categoryId = valueOrFactory;
    return this;
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory;
    return this;
  }

  withDescription(valueOrFactory: PropOrFactory<string | null>) {
    this._description = valueOrFactory;
    return this;
  }

  withIsActive(valueOrFactory: PropOrFactory<boolean>) {
    this._isActive = valueOrFactory;
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._createdAt = valueOrFactory;
    return this;
  }

  withInvalidNameTooLong(value?: string) {
    this._name = value ?? (() => this.chance.word({ length: 256 }));
    return this;
  }

  active() {
    this._isActive = true;
    return this;
  }

  inactive() {
    this._isActive = false;
    return this;
  }

  build(): TBuild extends Category[] ? Category[] : Category {
    const categories = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        const category = new Category({
          categoryId: !this._categoryId
            ? undefined
            : this.callFactory(this._categoryId, index),
          name: this.callFactory(this._name, index),
          description: this.callFactory(this._description, index),
          isActive: this.callFactory(this._isActive, index),
          ...(this._createdAt && {
            createdAt: this.callFactory(this._createdAt, index),
          }),
        });
        category.validate();
        return category;
      });
    return this.countObjs === 1 ? (categories[0] as any) : categories;
  }

  private callFactory<T>(valueOrFactory: PropOrFactory<T>, index: number) {
    return typeof valueOrFactory === "function"
      ? (valueOrFactory as any)(index)
      : valueOrFactory;
  }

  get categoryId() {
    return this.getValue("categoryId");
  }

  get name() {
    return this.getValue("name");
  }

  get description() {
    return this.getValue("description");
  }

  get isActive() {
    return this.getValue("isActive");
  }

  get createdAt() {
    return this.getValue("createdAt");
  }

  private getValue(prop: string) {
    const optional = ["categoryId", "createdAt"];
    const privateProp = `_${prop}` as keyof this;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} does not have a factory. Use with${
          prop.charAt(0).toUpperCase() + prop.slice(1)
        }() method to set a factory.`
      );
    }
    return this.callFactory(this[privateProp], 0);
  }
}
