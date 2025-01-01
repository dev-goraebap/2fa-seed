import { Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { cert, initializeApp, ServiceAccount } from "firebase-admin/app";
import { Firestore, getFirestore, Transaction } from "firebase-admin/firestore";

interface TransactionStore {
    transaction?: Transaction;
}

/**
 * @description
 * 파이어베이스 서비스
 * 
 * - 같은 디렉토리 안에 `firebase-admin-sdk.json` 파일을 위치해주세요.
 * - tsconfig.json 파일에서 `"resolveJsonModule": true` 옵션을 추가해주세요.
 * - [참고 문서] https://firebase.google.com/docs/admin/setup?hl=ko
 */
@Injectable()
export class FirebaseService {

    private readonly storage: AsyncLocalStorage<TransactionStore> = new AsyncLocalStorage();

    private firestore: Firestore;

    constructor() {
        import('./firebase-admin-sdk.json').then((serviceAccount) => {
            initializeApp({
                credential: cert(serviceAccount as ServiceAccount),
            });
            this.firestore = getFirestore();
            console.log('Init Firebase Admin SDK');
        });
    }

    getFirestore(): Firestore {
        return this.firestore;
    }

    getTransaction(): Transaction | undefined {
        const store = this.storage.getStore();
        return store?.transaction;
    }

    async runInTransaction<T>(callback: () => Promise<T>): Promise<T> {
        return await this.firestore.runTransaction(async t => {
            return this.storage.run({ transaction: t }, callback);
        });
    }
}