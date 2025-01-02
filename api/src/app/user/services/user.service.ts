import { BadRequestException, Injectable } from "@nestjs/common";

import { FirebaseService } from "src/shared/third-party";

import { UserRepository } from "../infra/repositories/user.repository";
import { UserModel } from "../models/user.model";

@Injectable()
export class UserService {

    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly userRepository: UserRepository,
    ) { }

    async getUserByEmailOrThrow(email: string): Promise<UserModel> {
        const user: UserModel = await this.userRepository.findUserByEmail(email);
        if (!user) {
            throw new BadRequestException('사용자를 찾을 수 없습니다.');
        }
        return user;
    }

    async updateNickname(user: UserModel, nickname: string): Promise<UserModel> {
        user = user.withUpdateNickname(nickname);
        await this.userRepository.save(user);
        return user;
    }

    async updatePassword(user: UserModel, password: string): Promise<void> {
        user = user.withUpdatePassword(password);
        await this.userRepository.save(user);
    }

    async withdraw(user: UserModel, callback: () => Promise<void>): Promise<void> {
        this.firebaseService.runInTransaction(async () => {
            await this.userRepository.remove(user);
            await callback();
        });
    }
}