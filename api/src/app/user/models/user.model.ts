import { plainToInstance } from "class-transformer";
import { OnlyProps } from "domain-shared/base";
import { Timestamp } from "firebase-admin/firestore";
import { nanoid } from "nanoid";

import { comparePassword, hashPassword } from "src/shared/security";
import { FirebaseModel } from "src/shared/third-party";

export class UserModel extends FirebaseModel {

    readonly id: string;
    readonly nickname: string;
    readonly email: string;
    readonly password?: string;

    static create(param: Pick<UserModel, 'nickname' | 'email' | 'password'>): UserModel {
        return plainToInstance(UserModel, {
            id: nanoid(30),
            email: param.email,
            password: hashPassword(param.password),
            nickname: param.nickname
        } as UserModel);
    }

    static fromFirebase(param: OnlyProps<UserModel>): UserModel {
        return plainToInstance(UserModel, {
            ...param,
            createdAt: (param.createdAt as unknown as Timestamp).toDate(),
            updatedAt: (param.updatedAt as unknown as Timestamp).toDate(),
        });
    }

    verifyPassword(password: string): boolean {
        return comparePassword(password, this.password);
    }
}