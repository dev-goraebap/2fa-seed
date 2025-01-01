import { Injectable } from "@nestjs/common";

import { OnlyProps } from "domain-shared/base";
import { CollectionReference } from "firebase-admin/firestore";
import { FirebaseRepository, FirebaseService } from "src/shared/third-party";

import { UserSocialModel } from "../../models/user-social.model";

@Injectable()
export class UserSocialRepository implements FirebaseRepository<UserSocialModel> {

    private readonly ref: FirebaseFirestore.CollectionReference<OnlyProps<UserSocialModel>>;

    constructor(
        protected readonly firebaseService: FirebaseService
    ) {
        this.ref = this.firebaseService.getFirestore().collection('user_socials') as CollectionReference<UserSocialModel>;
    }

    async findSocialBySocialId(socialId: string): Promise<UserSocialModel> {
        const snapshot = await this.ref
            .where('socialId', '==', socialId)
            .where('deletedAt', '==', null)
            .get();
        if (snapshot.empty) {
            return null;
        }

        const data = snapshot.docs.shift().data();
        if (!data) {
            return null;
        }

        return UserSocialModel.fromFirebase(data);
    }

    async save(entity: UserSocialModel): Promise<void> {
        const docRef = this.ref.doc(entity.id);
        const data = entity.toPlainObject();
        const t = this.firebaseService.getTransaction();
        if (t) {
            t.set(docRef, data);
        } else {
            await docRef.set(data);
        }
    }

    async remove(entity: UserSocialModel): Promise<void> {
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