import { Entity } from "../entity";

export class NotFoundError extends Error {
    constructor(id: any[] | any, entityClass: new (...args: any[]) => Entity) {
        const ids = Array.isArray(id) ? id.join(", ") : id;
        super(`Entity ${entityClass.name} not found with id(s): ${ids}`);
        this.name = "NotFoundError";
    }
}