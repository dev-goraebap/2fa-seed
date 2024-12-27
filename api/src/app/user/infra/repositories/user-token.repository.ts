import { Injectable } from "@nestjs/common";
import { CollectionReference } from "firebase-admin/firestore";

import { OnlyProps } from "domain-shared/base";
import { FirebaseRepository, FirebaseService } from "src/shared/third-party";

import { UserSessionModel } from "../../models";

@Injectable()
export class UserTokenRepository implements FirebaseRepository<UserSessionModel> {

    private readonly ref: FirebaseFirestore.CollectionReference<OnlyProps<UserSessionModel>>;

    constructor(
        protected readonly firebaseService: FirebaseService
    ) {
        this.ref = this.firebaseService.getFirestore().collection('user_tokens') as CollectionReference<UserSessionModel>;
    }

    async findUserTokenByRefreshToken(refreshToken: string): Promise<UserSessionModel> {
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

        return UserSessionModel.fromFirebase(data);
    }

    async save(entity: UserSessionModel): Promise<void | UserSessionModel> {
        const docRef = this.ref.doc(entity.id);
        const data = entity.toPlainObject();
        const t = this.firebaseService.getTransaction();
        if (t) {
            t.set(docRef, data);
        } else {
            await docRef.set(data);
        }
    }

    async remove(entity: UserSessionModel): Promise<void> {
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