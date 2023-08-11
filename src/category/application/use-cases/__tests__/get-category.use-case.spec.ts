import { NotFoundError } from "../../../../@seedwork/domain/errors/not-found.error";
import { Category } from "../../../domain/entitites/category";
import { CategoryInMemoryRepository } from "../../../infra/repositories/category-in-memory.repository";
import { GetCategoryUseCase } from "../get-category.use-case";

const makeSut = () => {
  const categoryRepository = new CategoryInMemoryRepository();
  const sut = new GetCategoryUseCase(categoryRepository);
  return { sut, categoryRepository };
};
describe("GetCategoryUseCase Unit Tests", () => {
  describe("execute()", () => {
    it("should throw an error if category is not found", async () => {
      const { sut } = makeSut();
      const promise = sut.execute({ id: "unexisting_id" });
      await expect(promise).rejects.toThrowError(
        new NotFoundError("Entity not found using ID unexisting_id")
      );
    });

    it("should retrieve an existing category", async () => {
      const { sut, categoryRepository } = makeSut();
      const spyFindById = jest.spyOn(categoryRepository, "findById");
      const items = [
        new Category({ name: "name 1" }),
        new Category({
          name: "name 2",
          description: "description 2",
        }),
        new Category({
          name: "name 3",
          description: "description 3",
          isActive: false,
        }),
      ];
      categoryRepository.items = items;
      expect(spyFindById).not.toBeCalled();
      for (const [i, category] of items.entries()) {
        const result = await sut.execute({ id: category.id });
        expect(result).toStrictEqual({
          id: category.id,
          name: category.name,
          description: category.description,
          isActive: category.isActive,
          createdAt: category.createdAt,
        });
        expect(spyFindById).toBeCalledTimes(i + 1);
      }
    });
  });
});
