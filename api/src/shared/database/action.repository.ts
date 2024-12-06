export interface ActionRepository<T> {
    save(entity: T): Promise<T | void>;
    remove(entity: T): Promise<void>;
}