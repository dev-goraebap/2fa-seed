import { Injectable } from "@nestjs/common";
import { OnlyProps } from "domain-shared/base";
import { FirestoreService, fromFirebase } from "src/shared/third-party";
import { UserTokenModel } from "../../models";


@Injectable()
export class UserTokenRepository {

    private readonly ref: FirebaseFirestore.CollectionReference<OnlyProps<UserTokenModel>>;

    constructor(
        private readonly firebaseManager: FirestoreService
    ) {
        const firestore = this.firebaseManager.getFirestore();
        this.ref = firestore.collection('user_tokens') as FirebaseFirestore.CollectionReference<UserTokenModel>;
    }

    async findUserTokenByRefreshToken(refreshToken: string): Promise<UserTokenModel> {
        const snapshot = await this.ref
            .where('refreshToken', '==', refreshToken)
            .get();
        if (snapshot.empty) {
            return null;
        }

        const data = snapshot.docs.shift().data();
        if (!data) {
            return null;
        }

        return fromFirebase(UserTokenModel, data);
    }

    async save(entity: UserTokenModel): Promise<void | UserTokenModel> {
        const docRef = this.ref.doc(entity.id);
        const data = entity.toPlainObject();
        const t = this.firebaseManager.getTransaction();
        if (t) {
            t.set(docRef, data);
        } else {
            await docRef.set(data);
        }
    }

    async remove(entity: UserTokenModel): Promise<void> {
        await this.ref.doc(entity.id).set({
            ...entity,
            deletedAt: new Date(),
        });
    }

}