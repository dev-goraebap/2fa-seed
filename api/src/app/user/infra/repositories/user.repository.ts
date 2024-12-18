import { Injectable } from "@nestjs/common";

import { FirebaseRepository, FirestoreService, fromFirebase } from "src/shared/third-party";

import { UserModel } from "../../models";

@Injectable()
export class UserRepository extends FirebaseRepository<UserModel> {
    constructor(
        protected readonly firebaseManager: FirestoreService
    ) {
        super(firebaseManager);
    }

    async findUserById(userId: string): Promise<UserModel> {
        const snapshot = await this.ref.doc(userId).get();
        if (!snapshot.exists) {
            return null;
        }

        const data = snapshot.data();
        if (!data) {
            return null;
        }

        return fromFirebase(UserModel, data);
    }

    async findUserByEmail(email: string): Promise<UserModel> {
        const snapshot = await this.ref
            .where('email', '==', email)
            .get();
        if (snapshot.empty) {
            return null;
        }

        const data = snapshot.docs.shift().data();
        if (!data) {
            return null;
        }

        return fromFirebase(UserModel, data);
    }

    async findUserByOtpWithEmail(otp: string, email: string): Promise<UserModel> {
        const snapshot = await this.ref
            .where('email', '==', email)
            .where('otp', '==', otp)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        const data = snapshot.docs[0].data();
        if (!data) {
            return null;
        }

        return fromFirebase(UserModel, data);
    }

    async findUserByOtpWithPhoneNumber(otp: string, phoneNumber: string): Promise<UserModel> {
        const snapshot = await this.ref
            .where('phoneNumber', '==', phoneNumber)
            .where('otp', '==', otp)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        const data = snapshot.docs[0].data();
        if (!data) {
            return null;
        }

        return fromFirebase(UserModel, data);
    }

    async save(entity: UserModel): Promise<void> {
        const docRef = this.ref.doc(entity.id);
        const data = entity.toPlainObject();
        const t = this.firebaseManager.getTransaction();
        if (t) {
            t.set(docRef, data);
        } else {
            await docRef.set(data);
        }
    }

    async remove(entity: UserModel): Promise<void> {
        await this.ref.doc(entity.id).set({
            ...entity,
            deletedAt: new Date(),
        });
    }
}