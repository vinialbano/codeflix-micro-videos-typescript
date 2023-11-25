import { Repository } from "../../shared/domain/repository/repository";
import { UUID } from "../../shared/domain/value-objects/uuid.vo";
import { Category } from "./category.entity";

export interface CategoryRepository extends Repository<Category, UUID> {}
