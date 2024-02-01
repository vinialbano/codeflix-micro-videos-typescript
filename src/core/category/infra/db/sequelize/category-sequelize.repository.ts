import { Op, literal } from 'sequelize';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Category, CategoryId } from '../../../domain/category.aggregate';
import {
  CategoryRepository,
  CategorySearchParams,
  CategorySearchResult,
} from '../../../domain/category.repository';
import { CategoryModel } from './category.model';
import { CategoryModelMapper } from './category-model.mapper';
import { SortCriterion } from '@core/shared/domain/repository/search-params';
import { Literal } from 'sequelize/lib/utils';

export class CategorySequelizeRepository implements CategoryRepository {
  sortableFields: string[] = ['name', 'createdAt'];
  orderBy: Record<string, Record<string, Literal>> = {
    mysql: {
      name: literal(`binary name`),
    },
  };

  constructor(private categoryModel: typeof CategoryModel) {}

  async insert(entity: Category): Promise<void> {
    const modelProps = CategoryModelMapper.toModel(entity).toJSON();
    await this.categoryModel.create(modelProps);
  }

  async insertMany(entities: Category[]): Promise<void> {
    const modelsProps = entities.map((entity) =>
      CategoryModelMapper.toModel(entity).toJSON(),
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

  async delete(id: CategoryId): Promise<void> {
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

  async findById(entityId: CategoryId): Promise<Category | null> {
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
    let sortCriteria =
      props.sortCriteria && !Array.isArray(props.sortCriteria)
        ? [props.sortCriteria]
        : props.sortCriteria;
    if (sortCriteria) {
      sortCriteria = sortCriteria.filter((criterion) =>
        this.sortableFields.includes(criterion.field),
      );
      if (!sortCriteria.length) {
        sortCriteria = null;
      }
    }
    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      ...(props.filter && {
        where: {
          name: { [Op.like]: `%${props.filter}%` },
        },
      }),
      ...(sortCriteria
        ? { order: this.formatSort(sortCriteria) }
        : { order: [['createdAt', 'desc']] }),
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

  private formatSort(
    sortCriteria: SortCriterion<Category>[],
  ): [string | Literal, string][] {
    const dialect = this.categoryModel.sequelize!.getDialect();
    return sortCriteria.map(({ field, direction }) => {
      if (this.orderBy[dialect]?.[field]) {
        return [this.orderBy[dialect]![field]!, direction ?? 'asc'];
      }
      return [field, direction ?? 'asc'];
    });
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
