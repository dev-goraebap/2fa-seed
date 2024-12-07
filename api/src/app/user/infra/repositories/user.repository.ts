import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ActionRepository } from "src/shared/database";
import { Repository } from "typeorm";
import { UserEntity } from "../entities";

@Injectable()
export class UserRepository implements ActionRepository<UserEntity> {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    async findUserByEmail(username: string) {
        return this.userRepository.findOne({
            where: {
                email: username
            }
        });
    }

    findUserByOtpWithEmail(otp: string, email: string) {
        return this.userRepository.findOne({
            where: {
                otp,
                email
            }
        });
    }

    findUserByOtpWithPhoneNumber(otp: string, phoneNumber: string) {
        return this.userRepository.findOne({
            where: {
                otp,
                phoneNumber
            }
        });
    }

    async save(entity: UserEntity): Promise<void> {
        await this.userRepository.save(entity);
    }

    async remove(entity: UserEntity): Promise<void> {
        await this.userRepository.remove(entity);
    }
}