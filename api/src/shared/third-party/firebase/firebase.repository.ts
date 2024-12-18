export interface FirebaseRepository<T> {
    save(entity: T): Promise<void | T>;
    remove(entity: T): Promise<void>;
}