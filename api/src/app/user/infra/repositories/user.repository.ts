import { Injectable } from "@nestjs/common";

import { OnlyProps } from 'domain-shared/base';
import { FirebaseService, fromFirebase } from "src/shared/third-party";

import { UserModel } from "../../models";

@Injectable()
export class UserRepository {

    private readonly userRef: FirebaseFirestore.CollectionReference<OnlyProps<UserModel>>;

    constructor(
        private readonly firebaseService: FirebaseService
    ) {
        const firestore = this.firebaseService.getFireStore();
        this.userRef = firestore.collection('users') as FirebaseFirestore.CollectionReference<UserModel>;
    }

    async findUserById(userId: string): Promise<UserModel> {
        const snapshot = await this.userRef.doc(userId).get();
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
        const snapshot = await this.userRef
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
        const snapshot = await this.userRef
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
        const snapshot = await this.userRef
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
        await this.userRef.doc(entity.id).set(entity.toPlainObject());
    }

    async remove(entity: UserModel): Promise<void> {
        await this.userRef.doc(entity.id).set({
            ...entity,
            deletedAt: new Date(),
        });
    }
}