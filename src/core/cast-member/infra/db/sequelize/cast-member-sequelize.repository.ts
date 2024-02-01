import { Op, literal } from 'sequelize';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import {
  CastMember,
  CastMemberId,
} from '../../../domain/cast-member.aggregate';
import {
  CastMemberRepository,
  CastMemberSearchParams,
  CastMemberSearchResult,
} from '../../../domain/cast-member.repository';
import { CastMemberModel } from './cast-member.model';
import { CastMemberModelMapper } from './cast-member-model.mapper';
import { SortCriterion } from '@core/shared/domain/repository/search-params';
import { Literal } from 'sequelize/lib/utils';

export class CastMemberSequelizeRepository implements CastMemberRepository {
  sortableFields: string[] = ['name', 'type', 'createdAt'];
  orderBy: Record<string, Record<string, Literal>> = {
    mysql: {
      name: literal(`binary name`),
    },
  };

  constructor(private castMemberModel: typeof CastMemberModel) {}

  async insert(entity: CastMember): Promise<void> {
    const modelProps = CastMemberModelMapper.toModel(entity).toJSON();
    await this.castMemberModel.create(modelProps);
  }

  async insertMany(entities: CastMember[]): Promise<void> {
    const modelsProps = entities.map((entity) =>
      CastMemberModelMapper.toModel(entity).toJSON(),
    );
    await this.castMemberModel.bulkCreate(modelsProps);
  }

  async update(entity: CastMember): Promise<void> {
    const id = entity.castMemberId.id;
    const model = await this._get(id);
    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    const modelProps = CastMemberModelMapper.toModel(entity).toJSON();
    await this.castMemberModel.update(modelProps, {
      where: {
        castMemberId: id,
      },
    });
  }

  async delete(id: CastMemberId): Promise<void> {
    const model = await this._get(id.id);
    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }
    await this.castMemberModel.destroy({
      where: {
        castMemberId: id.id,
      },
    });
  }

  async findById(entityId: CastMemberId): Promise<CastMember | null> {
    const model = await this.castMemberModel.findByPk(entityId.id);
    return model ? CastMemberModelMapper.toEntity(model) : null;
  }

  async findAll(): Promise<CastMember[]> {
    const models = await this.castMemberModel.findAll();
    return models.map((model) => CastMemberModelMapper.toEntity(model));
  }

  async search(props: CastMemberSearchParams): Promise<CastMemberSearchResult> {
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
    const { rows: models, count } = await this.castMemberModel.findAndCountAll({
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

    return new CastMemberSearchResult({
      items: models.map((model) => CastMemberModelMapper.toEntity(model)),
      currentPage: props.page,
      total: count,
      limit,
    });
  }

  private async _get(id: string): Promise<CastMemberModel | null> {
    return await this.castMemberModel.findByPk(id);
  }

  private formatSort(
    sortCriteria: SortCriterion<CastMember>[],
  ): [string | Literal, string][] {
    const dialect = this.castMemberModel.sequelize!.getDialect();
    return sortCriteria.map(({ field, direction }) => {
      if (this.orderBy[dialect]?.[field]) {
        return [this.orderBy[dialect]![field]!, direction ?? 'asc'];
      }
      return [field, direction ?? 'asc'];
    });
  }

  getEntity(): new (...args: any[]) => CastMember {
    return CastMember;
  }
}
