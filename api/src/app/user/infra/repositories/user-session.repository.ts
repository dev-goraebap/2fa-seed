import { Injectable } from "@nestjs/common";
import { CollectionReference } from "firebase-admin/firestore";

import { OnlyProps } from "domain-shared/base";
import { FirebaseRepository, FirebaseService } from "src/shared/third-party";

import { UserSessionModel } from "../../models/user-session.model";

@Injectable()
export class UserSessionRepository implements FirebaseRepository<UserSessionModel> {

    private readonly ref: FirebaseFirestore.CollectionReference<OnlyProps<UserSessionModel>>;

    constructor(
        protected readonly firebaseService: FirebaseService
    ) {
        this.ref = this.firebaseService.getFirestore().collection('user_sessions') as CollectionReference<UserSessionModel>;
    }

    async findSessionsByUserId(id: string): Promise<UserSessionModel[]> {
        const snapshot = await this.ref
            .where('userId', '==', id)
            .where('deletedAt', '==', null)
            .orderBy('lastRefreshingDate', 'desc')
            .get();

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map(doc => UserSessionModel.fromFirebase(doc.data()));
    }

    async findSessionByRefreshToken(refreshToken: string): Promise<UserSessionModel> {
        const snapshot = await this.ref
            .where('refreshToken', '==', refreshToken)
            .where('deletedAt', '==', null)
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

    async findUserSessionByDeviceId(deviceId: string): Promise<UserSessionModel> {
        const snapshot = await this.ref
            .where('deviceId', '==', deviceId)
            .where('deletedAt', '==', null)
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

    async findSessionByUserIdWithDeviceId(userId: string, deviceId: string): Promise<UserSessionModel> {
        const snapshot = await this.ref
            .where('userId', '==', userId)
            .where('deviceId', '==', deviceId)
            .where('deletedAt', '==', null)
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