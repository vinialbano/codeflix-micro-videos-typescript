import { Chance } from 'chance';
import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { setupSequelize } from '../../tests/helpers/db';
import { SequelizeModelFactory } from './sequelize-model.factory';

@Table({ tableName: 'stubs', timestamps: false })
class StubModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING() })
  declare name: string;
}

const chance = new Chance();
const mockFactory = jest.fn(() => ({
  id: chance.guid({ version: 4 }),
  name: chance.word(),
}));
const StubModelFactory = () => {
  return new SequelizeModelFactory(StubModel, mockFactory);
};

describe('Sequelize Model Factory', () => {
  setupSequelize({
    models: [StubModel],
  });

  describe('create()', () => {
    it('should create a model', async () => {
      const factory = StubModelFactory();
      const model = await factory.create();
      expect(model).toBeInstanceOf(StubModel);
      expect(mockFactory).toHaveBeenCalled();
      const modelFound: StubModel = (await StubModel.findByPk(model.id))!;
      expect(modelFound.id).toEqual(model.id);
    });

    it('should create a model with custom data', async () => {
      const factory = StubModelFactory();
      const customData = {
        id: chance.guid({ version: 4 }),
        name: 'custom',
      };
      const model = await factory.create(customData);
      expect(model).toBeInstanceOf(StubModel);
      expect(mockFactory).not.toHaveBeenCalled();
      const modelFound: StubModel = (await StubModel.findByPk(model.id))!;
      expect(modelFound.id).toEqual(model.id);
      expect(modelFound.name).toEqual(customData.name);
    });
  });

  describe('make()', () => {
    it('should create a model without persisting', async () => {
      const factory = StubModelFactory();
      const model = await factory.make();
      expect(model).toBeInstanceOf(StubModel);
      expect(mockFactory).toHaveBeenCalled();
      const modelFound = await StubModel.findByPk(model.id);
      expect(modelFound).toBeNull();
    });

    it('should create a model without persisting, with custom data ', async () => {
      const factory = StubModelFactory();
      const customData = { id: chance.guid({ version: 4 }), name: 'custom' };
      const model = await factory.make(customData);
      expect(model).toBeInstanceOf(StubModel);
      expect(model.name).toEqual(customData.name);
      expect(mockFactory).not.toHaveBeenCalled();
      const modelFound = await StubModel.findByPk(model.id);
      expect(modelFound).toBeNull();
    });
  });

  describe('bulkCreate()', () => {
    it('should create a single model with a default factory', async () => {
      const factory = StubModelFactory();
      const createdModels = await factory.bulkCreate();
      expect(mockFactory).toHaveBeenCalled();
      const foundModels = await StubModel.findAll();
      expect(foundModels).toHaveLength(1);
      expect(createdModels).toHaveLength(1);
      expect(createdModels[0].id).toEqual(foundModels[0].id);
    });

    it('should create a single model with a custom factory', async () => {
      const factory = StubModelFactory();
      const createdModels = await factory.bulkCreate((index) => ({
        id: chance.guid({ version: 4 }),
        name: `custom-${index}`,
      }));
      expect(mockFactory).not.toHaveBeenCalled();
      const foundModels = await StubModel.findAll();
      expect(foundModels).toHaveLength(1);
      expect(createdModels).toHaveLength(1);
      expect(createdModels[0].id).toEqual(foundModels[0].id);
      expect(createdModels[0].name).toEqual('custom-0');
    });

    it('should create multiple models with a default factory when count greater than 1 is used', async () => {
      const factory = StubModelFactory().count(5);
      const createdModels = await factory.bulkCreate();
      expect(mockFactory).toHaveBeenCalled();
      const foundModels = await StubModel.findAll();
      expect(foundModels).toHaveLength(5);
      expect(createdModels).toHaveLength(5);
      for (let i = 0; i < 5; i++) {
        expect(createdModels[i].id).toEqual(foundModels[i].id);
        expect(createdModels[i].name).toEqual(foundModels[i].name);
      }
    });

    it('should create multiple models with custom factories when count greater than 1 is used', async () => {
      const factory = StubModelFactory().count(5);
      const createdModels = await factory.bulkCreate((index) => ({
        id: chance.guid({ version: 4 }),
        name: `custom-${index}`,
      }));
      expect(mockFactory).not.toHaveBeenCalled();
      const foundModels = await StubModel.findAll();
      expect(foundModels).toHaveLength(5);
      expect(createdModels).toHaveLength(5);
      for (let i = 0; i < 5; i++) {
        expect(createdModels[i].id).toEqual(foundModels[i].id);
        expect(createdModels[i].name).toEqual(`custom-${i}`);
      }
    });
  });

  describe('bulkMake()', () => {
    it('should create a single model without persisting with the default factory', async () => {
      const factory = StubModelFactory();
      const createdModels = await factory.bulkMake();
      expect(mockFactory).toHaveBeenCalled();
      const foundModels = await StubModel.findAll();
      expect(foundModels).toHaveLength(0);
      expect(createdModels).toHaveLength(1);
    });

    it('should create a single model without persisting with a custom factory', async () => {
      const factory = StubModelFactory();
      const createdModels = await factory.bulkMake((index) => ({
        id: chance.guid({ version: 4 }),
        name: `custom-${index}`,
      }));
      expect(mockFactory).not.toHaveBeenCalled();
      const foundModels = await StubModel.findAll();
      expect(foundModels).toHaveLength(0);
      expect(createdModels).toHaveLength(1);
      expect(createdModels[0].name).toEqual('custom-0');
    });

    it('should create multiple models without persisting, with the default factory', async () => {
      const factory = StubModelFactory().count(5);
      const createdModels = await factory.bulkMake();
      expect(mockFactory).toHaveBeenCalled();
      const foundModels = await StubModel.findAll();
      expect(foundModels).toHaveLength(0);
      expect(createdModels).toHaveLength(5);
    });

    it('should create multiple models without persisting, with custom factories', async () => {
      const factory = StubModelFactory().count(5);
      const createdModels = await factory.bulkMake((index) => ({
        id: chance.guid({ version: 4 }),
        name: `custom-${index}`,
      }));
      expect(mockFactory).not.toHaveBeenCalled();
      const foundModels = await StubModel.findAll();
      expect(foundModels).toHaveLength(0);
      expect(createdModels).toHaveLength(5);
      for (let i = 0; i < 5; i++) {
        expect(createdModels[i].name).toEqual(`custom-${i}`);
      }
    });
  });
});
