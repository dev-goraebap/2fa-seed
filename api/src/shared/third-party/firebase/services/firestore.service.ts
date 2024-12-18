import { Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { Firestore, getFirestore, Transaction } from "firebase-admin/firestore";

interface TransactionStore {
    transaction?: Transaction;
}

@Injectable()
export class FirestoreService {
    private readonly storage: AsyncLocalStorage<TransactionStore> = new AsyncLocalStorage();
    private readonly db: Firestore = getFirestore('twofa-seed');

    getFirestore(): Firestore {
        return this.db;
    }

    getTransaction(): Transaction | undefined {
        const store = this.storage.getStore();
        return store?.transaction;
    }

    async runInTransaction<T>(callback: () => Promise<T>): Promise<T> {
        return await this.db.runTransaction(async t => {
            return this.storage.run({ transaction: t }, callback);
        });
    }
}