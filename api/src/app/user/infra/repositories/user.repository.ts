import { Injectable } from "@nestjs/common";

import { FirebaseRepository, FirebaseService, fromFirebase } from "src/shared/third-party";

import { OnlyProps } from "domain-shared/base";
import { CollectionReference } from "firebase-admin/firestore";
import { UserModel } from "../../models";

@Injectable()
export class UserRepository implements FirebaseRepository<UserModel> {

    private readonly ref: FirebaseFirestore.CollectionReference<OnlyProps<UserModel>>;

    constructor(
        protected readonly firebaseService: FirebaseService
    ) {
        this.ref = this.firebaseService.getFirestore().collection('users') as CollectionReference<UserModel>;
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
        const t = this.firebaseService.getTransaction();
        if (t) {
            t.set(docRef, data);
        } else {
            await docRef.set(data);
        }
    }

    async remove(entity: UserModel): Promise<void> {
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