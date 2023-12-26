import { DataType, Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { Category } from "../../../../domain/category.entity";
import { Config } from "../../../../../shared/infra/config";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";

describe("CategoryModel Integration Tests", () => {
  setupSequelize({
    models: [CategoryModel],
  });

  it("should map the properties correctly", () => {
    const attributesMap = CategoryModel.getAttributes();
    const attributes = Object.keys(attributesMap);

    expect(attributes).toStrictEqual([
      "categoryId",
      "name",
      "description",
      "isActive",
      "createdAt",
    ]);
    expect(attributesMap.categoryId).toMatchObject({
      field: "categoryId",
      fieldName: "categoryId",
      primaryKey: true,
      type: DataType.UUID(),
    });
    expect(attributesMap.name).toMatchObject({
      field: "name",
      fieldName: "name",
      allowNull: false,
      type: DataType.STRING(255),
    });
    expect(attributesMap.description).toMatchObject({
      field: "description",
      fieldName: "description",
      allowNull: true,
      type: DataType.TEXT(),
    });
    expect(attributesMap.isActive).toMatchObject({
      field: "isActive",
      fieldName: "isActive",
      allowNull: false,
      type: DataType.BOOLEAN(),
    });
    expect(attributesMap.createdAt).toMatchObject({
      field: "createdAt",
      fieldName: "createdAt",
      allowNull: false,
      type: DataType.DATE(3),
    });
  });

  it("should create a category", async () => {
    const category = Category.fake().aCategory().build();

    const categoryModel = await CategoryModel.create({
      categoryId: category.categoryId.id,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt,
    });

    expect(categoryModel.toJSON()).toStrictEqual(category.toJSON());
  });
});
