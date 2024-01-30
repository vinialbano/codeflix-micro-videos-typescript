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
import { SortDirection } from '@core/shared/domain/repository/search-params';
import { Literal } from 'sequelize/lib/utils';

export class CategorySequelizeRepository implements CategoryRepository {
  sortableFields: string[] = ['name', 'createdAt'];
  orderBy: Record<
    string,
    Record<string, (sortDirection: SortDirection) => Literal>
  > = {
    mysql: {
      name: (sortDirection: SortDirection) =>
        literal(`binary name ${sortDirection}`),
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

    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      ...(props.filter && {
        where: {
          name: { [Op.like]: `%${props.filter}%` },
        },
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? {
            order: this.formatSort(props.sort, props.sortDirection ?? 'asc'),
          }
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
    sort: string,
    sortDirection: SortDirection,
  ): Literal | [string, string][] {
    const dialect = this.categoryModel.sequelize!.getDialect();
    if (this.orderBy[dialect]?.[sort]) {
      return this.orderBy[dialect]![sort]!(sortDirection);
    }
    return [[sort, sortDirection]];
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
