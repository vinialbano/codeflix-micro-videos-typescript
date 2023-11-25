import { IsArray, IsNumber, IsPositive, Max, Min } from "class-validator";
import { ClassValidatorFields } from "../validators/class-validator-fields";
import { SearchResult } from "./search-result";
import { Entity } from "../entity";

class SearchResultRules<E> {
  @IsArray()
  items!: E[];

  @Min(0)
  @IsNumber()
  total!: number;

  @IsPositive()
  @IsNumber()
  currentPage!: number;

  @IsPositive()
  @IsNumber()
  limit!: number;

  constructor(props: SearchResult) {
    Object.assign(this, { ...props });
  }
}

export class SearchResultValidator<
  E extends Entity
> extends ClassValidatorFields<SearchResultRules<E>> {
  validate(vo: SearchResult) {
    const rules = new SearchResultRules(vo);
    return super.validate(rules);
  }
}

export class SearchResultValidatorFactory {
  static create() {
    return new SearchResultValidator();
  }
}
