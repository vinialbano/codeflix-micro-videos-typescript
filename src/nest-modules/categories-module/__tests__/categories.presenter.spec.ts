import { instanceToPlain } from 'class-transformer';
import { CategoryPresenter } from '../categories.presenter';

describe('CategoryPresenter Unit Tests', () => {
  describe('constructor()', () => {
    it('should set values', () => {
      const createdAt = new Date();
      const presenter = new CategoryPresenter({
        id: '1',
        name: 'test',
        description: 'test',
        createdAt,
        isActive: true,
      });

      expect(presenter.id).toBe('1');
      expect(presenter.name).toBe('test');
      expect(presenter.description).toBe('test');
      expect(presenter.createdAt).toBe(createdAt);
      expect(presenter.isActive).toBe(true);
    });
  });

  it('should format data', () => {
    const createdAt = new Date();
    const presenter = new CategoryPresenter({
      id: '1',
      name: 'test',
      description: 'test',
      createdAt,
      isActive: true,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      id: '1',
      name: 'test',
      description: 'test',
      createdAt: createdAt.toISOString(),
      isActive: true,
    });
  });
});
