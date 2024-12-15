import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ActionRepository } from "src/shared/database";

import { UserTokenEntity } from "../entities";

@Injectable()
export class UserTokenRepository implements ActionRepository<UserTokenEntity> {

    constructor(
        @InjectRepository(UserTokenEntity)
        private readonly userTokenRepository: Repository<UserTokenEntity>,
    ) { }

    findUserTokenByRefreshToken(refreshToken: string) {
        return this.userTokenRepository.findOne({
            where: {
                refreshToken,
            }
        });
    }

    save(entity: UserTokenEntity): Promise<void | UserTokenEntity> {
        return this.userTokenRepository.save(entity);
    }

    async remove(entity: UserTokenEntity): Promise<void> {
        await this.userTokenRepository.softRemove(entity);
    }
}