import { IsString, validateSync } from "class-validator";
import { IsNullable } from "../class-validator-custom-decorators";

describe("IsNullable", () => {
  it("should skip validation if the target is null", () => {
    class TestModel {
      @IsString()
      @IsNullable({ always: true })
      value!: string | null;
    }

    const model = new TestModel();
    model.value = null;
    const errors = validateSync(model);
    expect(errors).toHaveLength(0);
  });

  it("should return errors if the target is undefined", () => {
    class TestModel {
      @IsString()
      @IsNullable({ always: true })
      value!: string | null;
    }

    const model = new TestModel();
    const errors = validateSync(model);
    expect(errors).toHaveLength(1);
  });
});
