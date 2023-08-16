import {
  Category,
  CategoryProperties,
  CategoryRepository,
} from '#category/domain';
import { NotFoundError, UniqueEntityID } from '#seedwork/domain';
import { Op } from 'sequelize';
import { CategoryModel } from './category-model';
import { CategoryModelMapper } from './category-model.mapper';

export class CategorySequelizeRepository
  implements CategoryRepository.Repository
{
  sortableFields: ('id' | keyof CategoryProperties)[];

  constructor(private readonly categoryModel: typeof CategoryModel) {
    this.sortableFields = ['id', 'name', 'isActive', 'createdAt'];
  }

  async insert(entity: Category): Promise<void> {
    await this.categoryModel.create(entity.toJSON());
  }

  async findById(id: string | UniqueEntityID): Promise<Category> {
    const model = await this._get(`${id}`);
    return CategoryModelMapper.toEntity(model);
  }

  async update(entity: Category): Promise<void> {
    const model = await this._get(`${entity.id}`);
    CategoryModelMapper.toEntity(model);
    await model.update(entity.toJSON());
  }

  async delete(id: string | UniqueEntityID): Promise<void> {
    const model = await this._get(`${id}`);
    CategoryModelMapper.toEntity(model);
    await model.destroy();
  }

  private async _get(id: string): Promise<CategoryModel> {
    return await this.categoryModel.findByPk(`${id}`, {
      rejectOnEmpty: new NotFoundError(`Entity not found using ID ${id}`),
    });
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();
    return models.map(CategoryModelMapper.toEntity);
  }

  async search(
    props: CategoryRepository.SearchParams = new CategoryRepository.SearchParams(),
  ): Promise<CategoryRepository.SearchResult> {
    console.log(this.sortableFields.includes(props.sort));

    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      limit: props.limit,
      offset: (props.page - 1) * props.limit,
      order:
        props.sort && this.sortableFields.includes(props.sort)
          ? [[props.sort, props.order]]
          : [['createdAt', 'DESC']],
      ...(props.filter && {
        where: { name: { [Op.like]: `%${props.filter}%` } },
      }),
    });
    return new CategoryRepository.SearchResult({
      items: models.map(CategoryModelMapper.toEntity),
      total: count,
      currentPage: props.page,
      limit: props.limit,
      filter: props.filter,
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? { sort: props.sort, order: props.order }
        : { sort: null, order: null }),
    });
  }
}
