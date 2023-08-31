import { Category } from '#category/domain';
import { EntityLoadError, EntityValidationError } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/tests';
import { CategoryModel } from '../category-model';
import { CategoryModelMapper } from '../category-model.mapper';

describe('CategoryModelMapper Integration Tests', () => {
  setupSequelize({
    models: [CategoryModel],
  });

  describe('toEntity()', () => {
    it('should throw an EntityLoadError if model is not valid', () => {
      jest.spyOn(Category, 'validate').mockImplementationOnce(() => {
        throw new EntityValidationError({
          _errors: [],
          name: { _errors: ['String must contain at least 1 character(s)'] },
        });
      });
      const model = new CategoryModel({
        id: '123a456b-890c-432a-b101-c234d567e890',
        name: '',
        description: 'Category 1 description',
        isActive: true,
        createdAt: new Date(),
      });
      expect(() => CategoryModelMapper.toEntity(model)).toThrowError(
        EntityLoadError,
      );
    });

    it('should throw a generic error if something else wrong happens', () => {
      jest.spyOn(Category, 'validate').mockImplementationOnce(() => {
        throw new Error('Something wrong happened');
      });
      const model = new CategoryModel({
        id: '123a456b-890c-432a-b101-c234d567e890',
        name: 'Category 1',
        description: 'Category 1 description',
        isActive: true,
        createdAt: new Date(),
      });
      expect(() => CategoryModelMapper.toEntity(model)).toThrowError(
        new Error('Something wrong happened'),
      );
    });

    it('should return a Category entity', () => {
      const model = new CategoryModel({
        id: '123a456b-890c-432a-b101-c234d567e890',
        name: 'Category 1',
        description: 'Category 1 description',
        isActive: true,
        createdAt: new Date(),
      });
      const entity = CategoryModelMapper.toEntity(model);
      expect(entity).toBeInstanceOf(Category);
      expect(entity.id).toStrictEqual(model.id);
      expect(entity.name).toStrictEqual(model.name);
      expect(entity.description).toStrictEqual(model.description);
      expect(entity.isActive).toStrictEqual(model.isActive);
      expect(entity.createdAt).toStrictEqual(model.createdAt);
    });
  });
});
