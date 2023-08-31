import { SequelizeModelFactory } from '#seedwork/infra/sequelize/sequelize-model.factory';
import { Chance } from 'chance';
import { CategoryModel } from './category-model';

const chance = new Chance();

export const CategoryModelFactory = () => {
  return new SequelizeModelFactory(CategoryModel, () => ({
    id: chance.guid({ version: 4 }),
    name: chance.name(),
    description: chance.sentence(),
    isActive: chance.bool(),
    createdAt: chance.date(),
  }));
};
