import { Injectable } from "@nestjs/common";
import { UserModel } from "../../models";

@Injectable()
export class UserRepository {

    constructor(

    ) { }

    async findUserById(userId: string): Promise<UserModel> {
        return null;
    }

    async findUserByEmail(username: string): Promise<UserModel> {
        return null;
    }

    async findUserByOtpWithEmail(otp: string, email: string): Promise<UserModel> {
        return null;
    }

    async findUserByOtpWithPhoneNumber(otp: string, phoneNumber: string): Promise<UserModel> {
        return null;
    }

    async save(entity: UserModel): Promise<void> {

    }

    async remove(entity: UserModel): Promise<void> {

    }
}