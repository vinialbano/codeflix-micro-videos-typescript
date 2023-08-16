import { setupSequelize } from '#seedwork/infra';
import { DataType } from 'sequelize-typescript';
import { CategoryModel } from '../category-model';

describe('CategoryModel Integration Tests', () => {
  setupSequelize({
    models: [CategoryModel],
  });
  it('should map the model to the table', async () => {
    expect(CategoryModel.getTableName()).toBe('categories');
    const attributesMap = CategoryModel.getAttributes();
    const attributes = Object.keys(attributesMap);
    expect(attributes).toStrictEqual([
      'id',
      'name',
      'description',
      'isActive',
      'createdAt',
    ]);
    expect(attributesMap.id).toMatchObject({
      field: 'id',
      fieldName: 'id',
      primaryKey: true,
      type: DataType.UUID(),
    });
    expect(attributesMap.name).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255),
    });
    expect(attributesMap.description).toMatchObject({
      field: 'description',
      fieldName: 'description',
      allowNull: true,
      type: DataType.TEXT(),
    });
    expect(attributesMap.isActive).toMatchObject({
      field: 'isActive',
      fieldName: 'isActive',
      allowNull: false,
      type: DataType.BOOLEAN(),
    });
    expect(attributesMap.createdAt).toMatchObject({
      field: 'createdAt',
      fieldName: 'createdAt',
      allowNull: false,
      type: DataType.DATE(),
    });
  });

  it('should create a category', async () => {
    const arrange = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Category 1',
      description: 'Category 1 description',
      isActive: true,
      createdAt: new Date(),
    };
    const category = await CategoryModel.create(arrange);
    expect(category.toJSON()).toStrictEqual(arrange);
  });
});
