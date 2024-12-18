import { OnlyProps } from "domain-shared/base";
import { FirestoreService } from "../services";

export abstract class FirebaseRepository<T> {

    protected readonly ref: FirebaseFirestore.CollectionReference<OnlyProps<T>>;

    constructor(
        protected readonly firebaseManager: FirestoreService
    ) {
        const firestore = this.firebaseManager.getFirestore();
        this.ref = firestore.collection('users') as FirebaseFirestore.CollectionReference<T>;
    }

    abstract save(entity: T): Promise<void | T>;
    abstract remove(entity: T): Promise<void>;
}