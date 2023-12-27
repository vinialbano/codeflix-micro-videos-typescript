import { Op } from "sequelize";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { UUID } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import {
  CategoryRepository,
  CategorySearchParams,
  CategorySearchResult,
} from "../../../domain/category.repository";
import { CategoryModel } from "./category.model";
import { CategoryModelMapper } from "./category-model.mapper";

export class CategorySequelizeRepository implements CategoryRepository {
  sortableFields: string[] = ["name", "createdAt"];

  constructor(private categoryModel: typeof CategoryModel) {}

  async insert(entity: Category): Promise<void> {
    const modelProps = CategoryModelMapper.toModel(entity).toJSON();
    await this.categoryModel.create(modelProps);
  }

  async insertMany(entities: Category[]): Promise<void> {
    const modelsProps = entities.map((entity) =>
      CategoryModelMapper.toModel(entity).toJSON()
    );
    await this.categoryModel.bulkCreate(modelsProps);
  }

  async update(entity: Category): Promise<void> {
    const id = entity.categoryId.id;
    const model = await this._get(id);
    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    const modelProps = CategoryModelMapper.toModel(entity).toJSON();
    await this.categoryModel.update(modelProps, {
      where: {
        categoryId: id,
      },
    });
  }

  async delete(id: UUID): Promise<void> {
    const model = await this._get(id.id);
    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }
    await this.categoryModel.destroy({
      where: {
        categoryId: id.id,
      },
    });
  }

  async findById(entityId: UUID): Promise<Category | null> {
    const model = await this.categoryModel.findByPk(entityId.id);
    return model ? CategoryModelMapper.toEntity(model) : null;
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();
    return models.map((model) => CategoryModelMapper.toEntity(model));
  }

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    const offset = (props.page - 1) * props.limit;
    const limit = props.limit;

    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      ...(props.filter && {
        where: {
          name: { [Op.like]: `%${props.filter}%` },
        },
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? {
            order: [[props.sort, props.sortDirection ?? "asc"]],
          }
        : { order: [["createdAt", "desc"]] }),
      offset,
      limit,
    });

    return new CategorySearchResult({
      items: models.map((model) => CategoryModelMapper.toEntity(model)),
      currentPage: props.page,
      total: count,
      limit,
    });
  }

  private async _get(id: string): Promise<CategoryModel | null> {
    return await this.categoryModel.findByPk(id);
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
