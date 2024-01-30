import { Sequelize } from 'sequelize-typescript';
import { CategoryModel } from '../category.model';
import { CategoryModelMapper } from '../category-model.mapper';
import { EntityValidationError } from '../../../../../shared/domain/errors/validation.error';
import { Category } from '../../../../domain/category.aggregate';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';

describe('CategoryModelMapper Integration Tests', () => {
  setupSequelize({
    models: [CategoryModel],
  });

  describe('toModel()', () => {
    it('should return a valid model', () => {
      const entity = Category.fake().aCategory().build();
      const model = CategoryModelMapper.toModel(entity);
      expect(model).toMatchObject(entity.toJSON());
    });
  });

  describe('toEntity()', () => {
    it('should throw an error if the model is invalid', async () => {
      const model = CategoryModel.build({
        categoryId: 'f6a7d4d8-7f0c-4b5a-8b1a-7a3f9a7b1d8e',
        name: 'a'.repeat(256),
      } as any);
      expect.assertions(2);
      try {
        CategoryModelMapper.toEntity(model);
        fail('should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(EntityValidationError);
        expect((error as EntityValidationError).errors).toMatchObject([
          {
            name: ['name must be shorter than or equal to 255 characters'],
          },
        ]);
      }
    });

    it('should return a valid entity', () => {
      const entity = Category.fake().aCategory().build();
      const model = CategoryModel.build(entity.toJSON());
      const convertedEntity = CategoryModelMapper.toEntity(model);
      expect(convertedEntity).toMatchObject(entity);
    });
  });
});
