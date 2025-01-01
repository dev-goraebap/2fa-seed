import { Injectable } from "@nestjs/common";

import { FirebaseService } from "src/shared/third-party";

import { UserRepository } from "../infra/repositories/user.repository";
import { UserModel } from "../models/user.model";

@Injectable()
export class UserService {

    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly userRepository: UserRepository,
    ) { }

    async updateNickname(user: UserModel, nickname: string): Promise<UserModel> {
        user = user.withUpdateNickname(nickname);
        await this.userRepository.save(user);
        return user;
    }

    async withdraw(user: UserModel, callback: () => Promise<void>): Promise<void> {
        this.firebaseService.runInTransaction(async () => {
            await this.userRepository.remove(user);
            await callback();
        });
    }
}