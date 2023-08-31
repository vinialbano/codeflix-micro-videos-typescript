import { ListCategoriesUseCase } from '@codeflix/micro-videos/category/application';
import { Exclude, Expose } from 'class-transformer';
import { CollectionPresenter } from '../../@shared/presenters/collection.presenter';
import { CategoryPresenter } from './category.presenter';

export class CategoryCollectionPresenter extends CollectionPresenter {
  @Exclude()
  protected categoryPresenters: CategoryPresenter[];

  constructor(output: ListCategoriesUseCase.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.categoryPresenters = items.map((item) => new CategoryPresenter(item));
  }

  @Expose({ name: 'data' })
  get data() {
    return this.categoryPresenters;
  }
}
