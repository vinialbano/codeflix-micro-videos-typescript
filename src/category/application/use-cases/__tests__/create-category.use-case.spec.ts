import { CreateCategoryUseCase } from "#category/application";
import { CategoryInMemoryRepository } from "#category/infra";

const makeSut = () => {
  const categoryRepository = new CategoryInMemoryRepository();
  const sut = new CreateCategoryUseCase(categoryRepository);
  return { sut, categoryRepository };
};
describe("CreateCategoryUseCase Unit Tests", () => {
  describe("execute()", () => {
    it("should create and persist a new category", async () => {
      const { sut, categoryRepository } = makeSut();
      const spyInsert = jest.spyOn(categoryRepository, "insert");
      const arrange = [
        { name: "name 1" },
        {
          name: "name 2",
          description: "description 2",
        },
        {
          name: "name 3",
          description: "description 3",
          isActive: false,
        },
      ];
      expect(spyInsert).not.toBeCalled();
      for (const [i, input] of arrange.entries()) {
        const result = await sut.execute(input);
        const category = categoryRepository.items[i];
        expect(result).toStrictEqual({
          id: category.id,
          name: category.name,
          description: category.description,
          isActive: category.isActive,
          createdAt: category.createdAt,
        });
        expect(spyInsert).toBeCalledTimes(i + 1);
      }
    });
  });
});
