import { CreationAttributes, ModelStatic } from 'sequelize';
import { Model } from 'sequelize-typescript';

export class SequelizeModelFactory<T extends Model> {
  private _count = 1;
  constructor(
    private readonly model: ModelStatic<T>,
    private readonly factoryProps: () => CreationAttributes<T>,
  ) {}

  count(count: number) {
    this._count = count;
    return this;
  }

  async create(data?: CreationAttributes<T>): Promise<T> {
    return await this.model.create(data ?? this.factoryProps());
  }

  async make(data?: CreationAttributes<T>): Promise<T> {
    return this.model.build(data ?? this.factoryProps());
  }

  async bulkCreate(
    factoryProps?: (index: number) => CreationAttributes<T>,
  ): Promise<T[]> {
    const data = new Array(this._count)
      .fill(factoryProps || this.factoryProps)
      .map((factory, index) => factory(index));
    return this.model.bulkCreate(data);
  }

  async bulkMake(
    factoryProps?: (index: number) => CreationAttributes<T>,
  ): Promise<T[]> {
    const data = new Array(this._count)
      .fill(factoryProps || this.factoryProps)
      .map((factory, index) => factory(index));
    return this.model.bulkBuild(data);
  }
}
