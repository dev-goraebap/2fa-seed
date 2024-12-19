import { Injectable } from "@nestjs/common";
import { CollectionReference } from "firebase-admin/firestore";

import { OnlyProps } from "domain-shared/base";
import { FirebaseRepository, FirebaseService } from "src/shared/third-party";

import { UserTokenModel } from "../../models";

@Injectable()
export class UserTokenRepository implements FirebaseRepository<UserTokenModel> {

    private readonly ref: FirebaseFirestore.CollectionReference<OnlyProps<UserTokenModel>>;

    constructor(
        protected readonly firebaseService: FirebaseService
    ) {
        this.ref = this.firebaseService.getFirestore().collection('user_tokens') as CollectionReference<UserTokenModel>;
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

        return UserTokenModel.fromFirebase(data);
    }

    async save(entity: UserTokenModel): Promise<void | UserTokenModel> {
        const docRef = this.ref.doc(entity.id);
        const data = entity.toPlainObject();
        const t = this.firebaseService.getTransaction();
        if (t) {
            t.set(docRef, data);
        } else {
            await docRef.set(data);
        }
    }

    async remove(entity: UserTokenModel): Promise<void> {
        const docRef = this.ref.doc(entity.id);
        const data = entity.toPlainObject();
        const t = this.firebaseService.getTransaction();
        if (t) {
            t.set(docRef, {
                ...data,
                deletedAt: new Date(),
            });
        } else {
            await this.ref.doc(entity.id).set({
                ...data,
                deletedAt: new Date(),
            });
        }
    }
}