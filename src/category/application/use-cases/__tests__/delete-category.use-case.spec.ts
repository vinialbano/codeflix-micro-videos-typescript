import { NotFoundError } from "../../../../@seedwork/domain/errors/not-found.error";
import { Category } from "../../../domain/entitites/category";
import { CategoryInMemoryRepository } from "../../../infra/repositories/category-in-memory.repository";
import { DeleteCategoryUseCase } from "../delete-category.use-case";

const makeSut = () => {
  const categoryRepository = new CategoryInMemoryRepository();
  const sut = new DeleteCategoryUseCase(categoryRepository);
  return { sut, categoryRepository };
};
describe("DeleteCategoryUseCase Unit Tests", () => {
  describe("execute()", () => {
    it("should throw an error if category is not found", async () => {
      const { sut } = makeSut();
      const promise = sut.execute({ id: "unexisting_id" });
      await expect(promise).rejects.toThrowError(
        new NotFoundError("Entity not found using ID unexisting_id")
      );
    });

    it("should delete an existing category", async () => {
      const { sut, categoryRepository } = makeSut();
      const spyDelete = jest.spyOn(categoryRepository, "delete");
      const category = new Category({ name: "name 1" });
      categoryRepository.items = [category];
      expect(spyDelete).not.toBeCalled();

      const result = await sut.execute({ id: category.id });
      expect(result).toBeUndefined();
      expect(spyDelete).toBeCalled();
    });
  });
});
