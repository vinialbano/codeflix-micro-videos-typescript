import { instanceToPlain } from 'class-transformer';
import { CategoryPresenter } from '../category.presenter';

describe('CategoryPresenter Unit Tests', () => {
  describe('constructor()', () => {
    it('should set the properties', () => {
      const output = {
        id: 'id',
        name: 'name',
        description: 'description',
        isActive: true,
        createdAt: new Date(),
      };
      const presenter = new CategoryPresenter(output);
      expect(presenter.id).toBe(output.id);
      expect(presenter.name).toBe(output.name);
      expect(presenter.description).toBe(output.description);
      expect(presenter.isActive).toBe(output.isActive);
      expect(presenter.createdAt).toBe(output.createdAt);
    });
  });

  it('should transform the createdAt property to ISO string', () => {
    const output = {
      id: 'id',
      name: 'name',
      description: 'description',
      isActive: true,
      createdAt: new Date(),
    };
    const presenter = new CategoryPresenter(output);
    const data = instanceToPlain(presenter);
    expect(data).toStrictEqual({
      id: output.id,
      name: output.name,
      description: output.description,
      isActive: output.isActive,
      createdAt: output.createdAt.toISOString(),
    });
  });
});
